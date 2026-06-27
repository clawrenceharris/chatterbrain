import type { ConversationPhase } from "./ConversationPhase";

/** AI actor turn returned from DialoguePort.generateActorResponse */
export interface ActorResponse {
  content: string;
  /** Legacy UI hints; optional when using free-form input only */
  userResponseOptions: string[];
  nextPhase?: ConversationPhase;
  contextUsed?: string[];
}
