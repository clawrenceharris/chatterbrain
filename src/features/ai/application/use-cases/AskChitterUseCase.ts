import type { LlmPort } from "@/features/ai/domain";
import { buildChitterScenarioRecommendationPrompt } from "@/features/ai/persona";
import type { EncounterReadRepository } from "@/features/encounter/domain/repositories";
import type { ScenarioReadRepository } from "@/features/scenario/domain/repositories";
import { fail, ok, type Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";
import type {
  AskChitterInput,
  AskChitterOutput,
  ChitterChatMessage,
} from "../dto";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";

type AskChitterUseCaseResult = Result<AskChitterOutput, ApplicationError>;

type ChitterRecommendationResponse = {
  answer?: string;
  recommendedScenarioIds?: string[];
  reasonsByScenarioId?: Record<string, string>;
};

const MAX_QUESTION_LENGTH = 800;
const MAX_HISTORY_MESSAGES = 8;
const MAX_CANDIDATES = 8;
const MAX_RECOMMENDATIONS = 3;

export class AskChitterUseCase {
  constructor(
    private readonly scenarioRepository: ScenarioReadRepository,
    private readonly llm: LlmPort,
    private readonly encounterRepository?: EncounterReadRepository,
  ) {}

  async execute(input: AskChitterInput): Promise<AskChitterUseCaseResult> {
    const question = input.question.trim();
    if (!question || question.length > MAX_QUESTION_LENGTH) {
      return fail(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Ask Chitter a shorter question.",
        }),
      );
    }

    try {
      const scenarios = await this.scenarioRepository.listScenarioCards();
      const recentEncounterTitles = await this.getRecentEncounterTitles(
        input.userId,
      );
      const candidates = this.selectCandidates(question, scenarios);
      const response = await this.llm.generateText({
        messages: [
          {
            role: "system",
            content: buildChitterScenarioRecommendationPrompt({
              candidates,
              context: {
                question,
                currentPath: input.currentPath,
                userFirstName: input.userFirstName,
                recentEncounterTitles,
              },
            }),
          },
          ...this.sanitizeHistory(input.history ?? []),
          { role: "user", content: question },
        ],
        temperature: 0.25,
        maxOutputTokens: 700,
        metadata: {
          feature: "chitter-global-chat",
          userId: input.userId,
        },
      });

      return ok(
        this.toOutput(
          response.text,
          response.provider,
          response.model,
          candidates,
        ),
      );
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "Chitter could not answer right now. Please try again.",
        }),
      );
    }
  }

  private toOutput(
    rawText: string,
    provider: string,
    model: string,
    candidates: ScenarioCardResult[],
  ): AskChitterOutput {
    const parsed = this.parseResponse(rawText);
    const recommendedIds = parsed?.recommendedScenarioIds ?? [];
    const validRecommendations = recommendedIds
      .map((id) => candidates.find((scenario) => scenario.id === id))
      .filter((scenario): scenario is ScenarioCardResult => Boolean(scenario))
      .slice(0, MAX_RECOMMENDATIONS);
    const recommendedScenarios =
      validRecommendations.length > 0
        ? validRecommendations
        : candidates.slice(0, Math.min(2, candidates.length));

    return {
      answer:
        parsed?.answer ??
        rawText ??
        "Chitter found a few real Chatterbrain scenarios that may be useful next.",
      recommendedScenarios: recommendedScenarios.map((scenario) => ({
        scenario,
        reason:
          parsed?.reasonsByScenarioId?.[scenario.id] ??
          `This matches your question and gives you a focused place to practice ${scenario.focusSkills[0]?.toLowerCase() ?? "conversation skills"}.`,
      })),
      provider,
      model,
    };
  }

  private parseResponse(rawText: string): ChitterRecommendationResponse | null {
    try {
      const trimmed = rawText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      return JSON.parse(trimmed) as ChitterRecommendationResponse;
    } catch {
      return null;
    }
  }

  private async getRecentEncounterTitles(userId: string) {
    if (!this.encounterRepository) return [];

    const encounters =
      await this.encounterRepository.findEncountersByUserId(userId);
    return encounters
      .slice(0, 5)
      .map(
        (encounter) =>
          `${encounter.scenario.title} (${encounter.status.label})`,
      );
  }

  private sanitizeHistory(history: ChitterChatMessage[]) {
    return history
      .filter(
        (message) => message.role === "user" || message.role === "assistant",
      )
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 1000),
      }))
      .filter((message) => message.content.length > 0);
  }

  private selectCandidates(
    question: string,
    scenarios: ScenarioCardResult[],
  ): ScenarioCardResult[] {
    const tokens = question
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2);

    return [...scenarios]
      .map((scenario) => ({
        scenario,
        score: this.scoreScenario(tokens, scenario),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_CANDIDATES)
      .map(({ scenario }) => scenario);
  }

  private scoreScenario(tokens: string[], scenario: ScenarioCardResult) {
    const haystack = [
      scenario.title,
      scenario.description,
      scenario.difficulty,
      scenario.actor?.role,
      scenario.actor?.displayName,
      ...scenario.focusSkills,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const tokenScore = tokens.reduce(
      (score, token) => score + (haystack.includes(token) ? 1 : 0),
      0,
    );
    return tokenScore + (scenario.hasActiveEncounter ? 0.5 : 0);
  }
}
