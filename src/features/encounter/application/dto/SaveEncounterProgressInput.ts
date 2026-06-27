import type { ConversationTurn } from "../../domain/value-objects";
import type { ConversationPhase } from "../../domain/value-objects/ConversationPhase";

export type SaveEncounterProgressInput = {
  userId: string;
  encounterId: string;
  turns: ConversationTurn[];
  conversationPhase: ConversationPhase;
};
