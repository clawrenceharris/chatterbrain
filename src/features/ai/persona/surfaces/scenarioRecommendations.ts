import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import { buildChitterSystemPrompt } from "../buildChitterSystemPrompt";
import { formatScenarioCandidates } from "../formatters";

export type ChitterScenarioRecommendationContext = {
  question: string;
  currentPath?: string;
  userFirstName?: string | null;
  recentEncounterTitles?: string[];
};

export function buildChitterScenarioRecommendationPrompt({
  candidates,
  context,
}: {
  candidates: ScenarioCardResult[];
  context: ChitterScenarioRecommendationContext;
}) {
  return buildChitterSystemPrompt({
    surface: "Global scenario recommendation chat",
    taskRules: [
      "Recommend only scenarios from the candidate list.",
      "Return strict JSON only. Do not wrap it in markdown.",
      "Use recommendedScenarioIds as exact ids from the candidate list.",
      "If no scenario fits, return an empty recommendedScenarioIds array and explain what to search for.",
      "Keep the answer friendly, brief, and focused on the user's next practice step.",
    ],
    contextBlock: `User question:
${context.question}

Current path:
${context.currentPath ?? "Unknown"}

User first name:
${context.userFirstName ?? "Unknown"}

Recent encounter titles:
${context.recentEncounterTitles?.join(", ") || "None available"}

Candidate scenarios:
${formatScenarioCandidates(candidates)}

JSON schema:
{
  "answer": "Chitter's short answer",
  "recommendedScenarioIds": ["scenario id from candidates"],
  "reasonsByScenarioId": {
    "scenario id": "one short reason this scenario fits"
  }
}`,
  });
}
