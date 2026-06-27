import type { Encounter } from "../entities/Encounter";
import type {
  DeleteEncounterResult,
  EncounterCardResult,
} from "../../application/dto";
import type { ConversationTurn, ScoreSummary } from "../value-objects";
import type { ConversationPhase } from "../value-objects/ConversationPhase";
import type { SocialSkill } from "@/types";
import { UpdateEncounterValuesInput } from "../../application/dto/UpdateEncounterValuesInput";
import type { DeleteEncounterByIdInput } from "../../application/dto/DeleteEncounterByIdInput";

export type EncounterReviewItemDraft = {
  evidenceTurnId: string;
  criterion: SocialSkill;
  title: string;
  description: string;
  suggestion: string | null;
  score?: number;
  confidence?: number | null;
};

export type EncounterReviewDraft = {
  summary: string;
  skillScores: ScoreSummary;
  retryMoment?: {
    turnId: string;
    originalText: string;
    whyItMatters: string;
    suggestedRewrite: string;
  } | null;
  unlockedBadgeIds?: string[];
  items: EncounterReviewItemDraft[];
};

export type SaveEncounterProgressInput = {
  encounterId: string;
  userId: string;
  turns: ConversationTurn[];
  conversationPhase: ConversationPhase;
};

export interface EncounterRepository {
  updateEncounterValues(input: UpdateEncounterValuesInput): Promise<void>;
  deleteById(input: DeleteEncounterByIdInput): Promise<DeleteEncounterResult>;
  create(encounter: Encounter): Promise<EncounterCardResult>;
  saveProgress(input: SaveEncounterProgressInput): Promise<EncounterCardResult>;
  completeWithReview(input: {
    encounter: Encounter;
    review: EncounterReviewDraft;
  }): Promise<EncounterCardResult>;
}
