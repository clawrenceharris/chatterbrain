import type { ScenarioCardResult } from "@/features/scenario/application/dto";

export function formatScenarioCandidates(candidates: ScenarioCardResult[]) {
  if (candidates.length === 0) return "No scenario candidates are available.";

  return candidates
    .map(
      (scenario, index) => `${index + 1}. ${scenario.id} | ${scenario.slug}
Title: ${scenario.title}
Difficulty: ${scenario.difficulty}
Focus skills: ${scenario.focusSkills.join(", ")}
Actor: ${scenario.actor?.displayName ?? "None"} (${scenario.actor?.role ?? "No role"})
Description: ${scenario.description}`,
    )
    .join("\n\n");
}
