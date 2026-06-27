import type { EncounterReviewDraft } from "../repositories/EncounterRepository";
import type { EncounterMachineContext } from "../types";
import type { ConversationTurn } from "../value-objects";

export interface EncounterReviewPort {
  generateReview(input: {
    context: EncounterMachineContext;
    turns: ConversationTurn[];
    mockMode?: boolean;
  }): Promise<EncounterReviewDraft>;
}
