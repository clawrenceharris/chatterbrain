import { ScoreSummary, SocialSkill } from "@/types";
import { RetryMoment } from "./RetryMoment";
import { ConversationTurn } from "./ConversationTurn";
export enum ReviewItemType {
  STRENGTH = "strength",
  GROWTH_AREA = "growth_area",
}
export interface EncounterReview {
  id: string;
  skillScores: ScoreSummary;
  sessionId: string;
  summary: string;
  retryMoment: RetryMoment;
  unlockedBadgeIds: string[];
  items: EncounterReviewItem[];
  createdAt: string;
  updatedAt: string;
}

export interface EncounterReviewItem {
  id: string;
  reviewId: string;
  type: ReviewItemType;
  criterion: SocialSkill;
  title: string;
  evidence: ConversationTurn;
  confidence: number | null;
  createdAt: string;
  updatedAt: string;
  xpEarned: number;
  description: string;
  suggestion: string | null;
}
