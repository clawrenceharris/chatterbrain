import type { ConversationTurn } from "@/features/encounter/domain/value-objects";

export function formatTranscript(turns: ConversationTurn[]) {
  if (turns.length === 0) return "No conversation turns are available.";

  return turns
    .map((turn, index) => {
      const speaker = turn.speakerName ?? turn.role;
      return `${index + 1}. ${turn.id} | ${turn.role.toUpperCase()} | ${speaker}: ${turn.content}`;
    })
    .join("\n");
}
