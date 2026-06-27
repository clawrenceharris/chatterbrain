import { buildChitterSystemPrompt } from "../buildChitterSystemPrompt";
import { formatReviewChatContext } from "../formatters";
import { EncounterReviewChatContext } from "@/features/encounter/application/dto";

export function buildChitterReviewChatPrompt(
  context: EncounterReviewChatContext,
) {
  return buildChitterSystemPrompt({
    surface: "Encounter review chat",
    taskRules: [
      "Answer only using the current encounter review context.",
      "If the question is outside this review, say I can only help with this review here.",
      "Quote short phrases from the transcript when it makes feedback clearer.",
      "Offer one practical next step or rewrite when useful.",
      "Do not invent scenario details, scores, or feedback.",
    ],
    contextBlock: formatReviewChatContext(context),
  });
}
