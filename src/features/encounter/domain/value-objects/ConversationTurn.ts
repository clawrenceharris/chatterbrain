import type { ConversationPhase } from "./ConversationPhase";

export type ConversationRole = "user" | "actor";

export interface ConversationTurn {
  id: string;
  encounterId: string;
  role: ConversationRole;
  speakerId: string | null;
  speakerName: string | null;
  content: string;
  createdAt: string;
  phase?: ConversationPhase;
}
