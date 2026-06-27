import type { Response } from "openai/resources/responses/responses.mjs";
import type useOpenAI from "@/features/ai/hooks/use-open-ai";
import {
  clampActorNextPhase,
  buildEncounterPhaseGuidance,
} from "@/features/encounter/domain/session/encounter-phase";
import type { DialoguePort } from "../../domain/services/DialoguePort";
import type { EncounterMachineContext } from "../../domain/types/encounter-machine-context";
import type { ActorResponse } from "../../domain/value-objects/ActorResponse";
import type { ConversationPhase } from "../../domain/value-objects/ConversationPhase";
import type { UserResponseAnalysis } from "../../domain/value-objects/UserResponseAnalysis";
import { SocialSkill } from "@/types";
import {
  buildEncounterActorPrompt,
  buildEncounterAnalysisPrompt,
} from "./buildEncounterActorPrompt";
import {
  isEncounterDialogueMockMode,
  mockActorResponseDelay,
  mockAnalysisDelay,
} from "./mockDialogueDelay";
import { resolveNextPhase as resolveEncounterPhase } from "@/features/encounter/domain/session/encounter-phase";

const ACTOR_RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    content: { type: "string" },
    userResponseOptions: {
      type: "array",
      items: { type: "string" },
    },
    nextPhase: {
      type: "string",
      enum: ["introduction", "main_topic", "wrap_up"],
    },
  },
  required: ["content", "userResponseOptions", "nextPhase"],
  additionalProperties: false,
} as const;

const USER_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    clarity: { type: "number" },
    empathy: { type: "number" },
    assertiveness: { type: "number" },
    socialAwareness: { type: "number" },
    feedback: { type: "string" },
    betterResponse: { type: "string" },
  },
  required: [
    "clarity",
    "empathy",
    "assertiveness",
    "socialAwareness",
    "feedback",
    "betterResponse",
  ],
  additionalProperties: false,
} as const;

type ParsedActorResponse = {
  content?: string;
  userResponseOptions?: string[];
  nextPhase?: string;
  contextUsed?: string[];
};

type ParsedUserAnalysis = {
  clarity?: number;
  empathy?: number;
  assertiveness?: number;
  socialAwareness?: number;
  feedback?: string;
  betterResponse?: string;
  scores?: Record<string, number>;
};

/**
 * OpenAI-backed implementation of DialoguePort.
 */
export class OpenAIDialogueAdapter implements DialoguePort {
  private openai: ReturnType<typeof useOpenAI>;
  private history: any[] = [];
  private messageCount = 0;
  private mockMode = isEncounterDialogueMockMode();

  constructor(openai: ReturnType<typeof useOpenAI>) {
    this.openai = openai;
  }

  hydrateFromHistory(
    history: EncounterMachineContext["conversationHistory"],
  ): void {
    this.messageCount = history.filter(
      (turn) => turn.speaker === "actor",
    ).length;
    this.history = history.map((turn) => ({
      role: turn.speaker === "user" ? "user" : "assistant",
      content: turn.content,
    }));
  }

  async generateActorResponse(
    context: EncounterMachineContext,
  ): Promise<ActorResponse> {
    this.hydrateFromHistory(context.conversationHistory);

    if (this.mockMode) {
      const content = `Hi, ${context.userProfile.displayName ?? context.userProfile.username}, this is a mock reply for phase ${context.currentPhase}.`;
      await mockActorResponseDelay(content.length);

      return {
        content,
        userResponseOptions: [
          "That's interesting!",
          "This is a long response choice for testing purposes and to see whether it will fit in the response box",
          "I don't quite follow.",
          "That makes sense.",
        ],
      };
    }
    const prompt = this.buildActorPromptInstructions(context);

    try {
      const response = await this.openai.generateText({
        instructions: prompt,
        store: true,
        input: this.history,
        text: {
          format: {
            type: "json_schema",
            name: "actor_response",
            strict: true,
            schema: ACTOR_RESPONSE_JSON_SCHEMA,
          },
        },
      });
      this.history = [
        ...this.history,
        ...response.output.map((el) => {
          delete el.id;
          return el;
        }),
      ];
      this.messageCount++;
      return this.parseActorResponse(response, context);
    } catch (error) {
      console.error("Error generating actor response:", error);
      return this.getFallbackActorResponse(context);
    }
  }

  async analyzeUserResponse(
    userInput: string,
    context: EncounterMachineContext,
  ): Promise<UserResponseAnalysis> {
    const prompt = buildEncounterAnalysisPrompt(userInput, context);
    if (this.mockMode) {
      await mockAnalysisDelay();

      return {
        scores: {
          [SocialSkill.CLARITY]: 2,
          [SocialSkill.EMPATHY]: 3,
          [SocialSkill.ASSERTIVENESS]: 1,
        },
        feedback: "Mock analysis: Solid effort, some room to grow.",
        betterResponse: "Sure, I understand your point better now.",
      };
    }
    try {
      const response = await this.openai.generateText({
        input: [{ role: "system", content: prompt }],
        text: {
          format: {
            type: "json_schema",
            name: "user_response_analysis",
            strict: true,
            schema: USER_ANALYSIS_JSON_SCHEMA,
          },
        },
      });
      return this.parseUserAnalysis(response.output_text);
    } catch (error) {
      console.error("Error analyzing user response:", error);
      return this.getFallbackAnalysis();
    }
  }

  async shouldTransitionPhase(context: EncounterMachineContext) {
    const nextPhase = resolveEncounterPhase(
      context.currentPhase,
      context.conversationHistory,
      context.currentActorResponse?.nextPhase,
      { mockMode: this.mockMode },
    );

    if (nextPhase === context.currentPhase) {
      return { shouldTransition: false, nextPhase: context.currentPhase };
    }

    return { shouldTransition: true, nextPhase };
  }

  private buildActorPromptInstructions(
    context: EncounterMachineContext,
  ): string {
    const phaseGuidance = buildEncounterPhaseGuidance(
      context.currentPhase,
      context.conversationHistory,
    );

    return buildEncounterActorPrompt({
      context,
      actorMessageCount: this.messageCount,
      phaseGuidance,
    });
  }

  private parseActorResponse(
    response: Response,
    context: EncounterMachineContext,
  ): ActorResponse {
    const raw = response.output_text?.trim() ?? "";
    const parsed = this.tryParseJson<ParsedActorResponse>(raw);

    if (parsed?.content?.trim()) {
      return this.buildActorResponseFromParsed(parsed, context);
    }

    if (raw) {
      return {
        content: raw,
        userResponseOptions: [],
        nextPhase: this.inferNextPhase(context),
      };
    }

    return this.getFallbackActorResponse(context);
  }

  private buildActorResponseFromParsed(
    parsed: ParsedActorResponse,
    context: EncounterMachineContext,
  ): ActorResponse {
    const proposed = parsed.nextPhase as ConversationPhase | undefined;
    const nextPhase = clampActorNextPhase(
      proposed,
      context.currentPhase,
      context.conversationHistory,
    );

    return {
      content: parsed.content!.trim(),
      userResponseOptions: parsed.userResponseOptions ?? [],
      nextPhase,
      contextUsed: parsed.contextUsed ?? [],
    };
  }

  private resolveNextPhase(
    candidate: string | undefined,
    context: EncounterMachineContext,
  ): ConversationPhase | undefined {
    const phases: ConversationPhase[] = [
      "introduction",
      "main_topic",
      "wrap_up",
      "completed",
    ];

    if (candidate && phases.includes(candidate as ConversationPhase)) {
      return (
        clampActorNextPhase(
          candidate as ConversationPhase,
          context.currentPhase,
          context.conversationHistory,
        ) ?? context.currentPhase
      );
    }

    return context.currentPhase;
  }

  private inferNextPhase(
    context: EncounterMachineContext,
  ): ActorResponse["nextPhase"] {
    return context.currentPhase;
  }

  private parseUserAnalysis(response: string): UserResponseAnalysis {
    const parsed = this.tryParseJson<ParsedUserAnalysis>(response);
    if (parsed) {
      return {
        scores: {
          [SocialSkill.CLARITY]: parsed.clarity ?? parsed.scores?.clarity ?? 0,
          [SocialSkill.EMPATHY]: parsed.empathy ?? parsed.scores?.empathy ?? 0,
          [SocialSkill.ASSERTIVENESS]:
            parsed.assertiveness ?? parsed.scores?.assertiveness ?? 0,
          [SocialSkill.SOCIAL_AWARENESS]:
            parsed.socialAwareness ?? parsed.scores?.socialAwareness ?? 0,
          ...parsed.scores,
        },
        feedback: parsed.feedback || "Good response!",
        betterResponse:
          parsed.betterResponse ||
          "A better response could not be made. Great Job!",
      };
    }

    return this.getFallbackAnalysis();
  }

  private tryParseJson<T>(rawText: string): T | null {
    if (!rawText) return null;

    try {
      const trimmed = rawText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      return JSON.parse(trimmed) as T;
    } catch {
      return null;
    }
  }

  private getFallbackActorResponse(
    context: EncounterMachineContext,
  ): ActorResponse {
    const fallbackResponses = {
      introduction:
        "Sorry, I didn't quite catch that. Could you say that again?",
      main_topic: "I'm not sure I follow. What did you mean?",
      wrap_up: "I think I missed that last part. Could you repeat it?",
      completed: "Take care!",
    };
    return {
      content: fallbackResponses[context.currentPhase] || "I see.",
      userResponseOptions: [],
    };
  }

  private getFallbackAnalysis(): UserResponseAnalysis {
    return {
      scores: {
        [SocialSkill.CLARITY]: 6,
        [SocialSkill.EMPATHY]: 6,
        [SocialSkill.ASSERTIVENESS]: 6,
        [SocialSkill.SOCIAL_AWARENESS]: 6,
      },
      feedback:
        "Good response! Keep practicing to improve your communication skills.",
    };
  }
}

/** @deprecated Import OpenAIDialogueAdapter instead */
export { OpenAIDialogueAdapter as DialogueService };
