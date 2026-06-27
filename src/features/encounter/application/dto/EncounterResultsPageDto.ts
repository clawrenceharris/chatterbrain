import { SocialSkill } from "@/types";
import { ConversationTurn, ScoreSummary } from "../../domain/value-objects";

export type EncounterTurnInsight = {
  feedback: string;
  betterResponse: string | null;
  criterion: SocialSkill;
  score: number;
};

export type EncounterReviewResult = {
  summary: string;
  skillScores: ScoreSummary;
  retryMoment: unknown;
  unlockedBadgeIds: string[];
  turnInsights: Record<string, EncounterTurnInsight>;
};

export type EncounterResultsPageOutput = {
  id: string;
  scenario: {
    id: string;
    slug: string;
    title: string;
  };
  conversationHistory: ConversationTurn[];
  actor: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  review: EncounterReviewResult | null;
};
export type EncounterWithResults = {
  id: string;
  actor: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  scenario: {
    id: string;
    slug: string;
    title: string;
  };
  conversationHistory: ConversationTurn[];
  review: EncounterReviewResult | null;
};
export type EncounterResultsPageInput = {
  encounter: EncounterWithResults;
};
