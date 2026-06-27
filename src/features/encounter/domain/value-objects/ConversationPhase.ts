/**
 * Conversation phase within a scene session (not XState node names).
 * TODO: Enforce valid transitions in a domain service if AI omits nextPhase.
 */
export type ConversationPhase =
  | "introduction"
  | "main_topic"
  | "wrap_up"
  | "completed";
