import OpenAI from "openai";
import { buildChitterEncounterReviewPrompt } from "@/features/ai/persona";
import type { EncounterReviewPort } from "../../domain/services/EncounterReviewPort";
import type { EncounterMachineContext } from "../../domain/types";
import type {
  ConversationTurn,
  ScoreSummary,
} from "../../domain/value-objects";
import type {
  EncounterReviewDraft,
  EncounterReviewItemDraft,
} from "../../domain/repositories/EncounterRepository";
import { SocialSkill } from "@/types";

type ReviewResponse = {
  summary?: string;
  skillScores?: ScoreSummary;
  retryMoment?: EncounterReviewDraft["retryMoment"];
  turns?: Array<{
    turnId: string;
    criterion?: SocialSkill;
    feedback?: string;
    betterResponse?: string;
    score?: number;
    confidence?: number | null;
  }>;
};

export class OpenAIEncounterReviewAdapter implements EncounterReviewPort {
  async generateReview(input: {
    context: EncounterMachineContext;
    turns: ConversationTurn[];
  }): Promise<EncounterReviewDraft> {
    if (
      process.env.NEXT_PUBLIC_ENCOUNTER_REVIEW_MOCK === "true" ||
      !process.env.OPENAI_API_KEY ||
      !process.env.OPENAI_PROJECT_ID
    ) {
      return this.buildFallbackReview(input.context, input.turns);
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        project: process.env.OPENAI_PROJECT_ID,
      });

      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: this.buildPrompt(input.context, input.turns),
      });

      return this.parseReview(response.output_text, input.context, input.turns);
    } catch (error) {
      console.error("Failed to generate encounter review", error);
      return this.buildFallbackReview(input.context, input.turns);
    }
  }

  private buildPrompt(
    context: EncounterMachineContext,
    turns: ConversationTurn[],
  ): string {
    return buildChitterEncounterReviewPrompt(context, turns);
  }

  private parseReview(
    raw: string,
    context: EncounterMachineContext,
    turns: ConversationTurn[],
  ): EncounterReviewDraft {
    try {
      const parsed = JSON.parse(raw) as ReviewResponse;
      const fallback = this.buildFallbackReview(context, turns);
      const userTurns = turns.filter((turn) => turn.role === "user");

      const items = userTurns.map((turn) => {
        const reviewTurn = parsed.turns?.find(
          (item) => item.turnId === turn.id,
        );
        return this.buildReviewItem(turn, {
          criterion:
            reviewTurn?.criterion ?? this.pickPrimarySkill(parsed.skillScores),
          feedback: reviewTurn?.feedback,
          betterResponse: reviewTurn?.betterResponse,
          score: reviewTurn?.score,
          confidence: reviewTurn?.confidence,
        });
      });

      return {
        summary: parsed.summary ?? fallback.summary,
        skillScores: parsed.skillScores ?? fallback.skillScores,
        retryMoment: parsed.retryMoment ?? fallback.retryMoment,
        unlockedBadgeIds: [],
        items,
      };
    } catch (error) {
      console.error("Failed to parse encounter review JSON", error);
      return this.buildFallbackReview(context, turns);
    }
  }

  private buildFallbackReview(
    context: EncounterMachineContext,
    turns: ConversationTurn[],
  ): EncounterReviewDraft {
    const userTurns = turns.filter((turn) => turn.role === "user");
    const skillScores = this.normalizeScores(context.totalScores);
    const retryTurn = userTurns[0];

    return {
      summary:
        "You completed the conversation and gave yourself material to learn from. Chitter can help you spot what worked, what felt harder, and one small next step to try.",
      skillScores,
      retryMoment: retryTurn
        ? {
            turnId: retryTurn.id,
            originalText: retryTurn.content,
            whyItMatters:
              "This is a useful moment to make your intent a little easier to read.",
            suggestedRewrite: this.buildFallbackBetterResponse(retryTurn),
          }
        : null,
      unlockedBadgeIds: [],
      items: userTurns.map((turn) => this.buildReviewItem(turn)),
    };
  }

  private buildReviewItem(
    turn: ConversationTurn,
    review?: {
      criterion?: SocialSkill;
      feedback?: string;
      betterResponse?: string;
      score?: number;
      confidence?: number | null;
    },
  ): EncounterReviewItemDraft {
    return {
      evidenceTurnId: turn.id,
      criterion: review?.criterion ?? SocialSkill.CLARITY,
      title: "Response coaching",
      description:
        review?.feedback ??
        "Nice effort staying in the conversation. Try adding one clear detail or follow-up question so the other person has an easier path to respond.",
      suggestion:
        review?.betterResponse ?? this.buildFallbackBetterResponse(turn),
      score: review?.score,
      confidence: review?.confidence ?? null,
    };
  }

  private buildFallbackBetterResponse(turn: ConversationTurn): string {
    return `I hear you. ${turn.content} Could you tell me a little more about what matters most here?`;
  }

  private normalizeScores(scores: ScoreSummary): ScoreSummary {
    if (Object.keys(scores).length > 0) return scores;

    return {
      [SocialSkill.CLARITY]: 70,
      [SocialSkill.FOLLOW_UP]: 65,
    };
  }

  private pickPrimarySkill(scores?: ScoreSummary): SocialSkill {
    const [skill] = Object.keys(scores ?? {});
    return (skill as SocialSkill | undefined) ?? SocialSkill.CLARITY;
  }
}
