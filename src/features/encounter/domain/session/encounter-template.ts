import { renderTemplate } from "@/shared/utils/renderTemplate";
import type { EncounterPageOutput } from "../../application/dto";
import type { ProfileDetailResult } from "@/features/profile/application/dto";

export function buildEncounterTemplateValues(
  encounter: EncounterPageOutput,
  userProfile?: ProfileDetailResult,
): Record<string, unknown> {
  const values: Record<string, unknown> = {
    actor_name: encounter.actor.displayName,
    user_name: userProfile?.displayName ?? userProfile?.username ?? "you",
  };

  for (const variable of encounter.scenario.variables) {
    values[variable.id] =
      encounter.variableValues?.[variable.id] ?? variable.defaultValue ?? "";
  }

  return values;
}

export function getEncounterOpeningMessage(
  encounter: EncounterPageOutput,
  userProfile?: ProfileDetailResult,
): string {
  const values = buildEncounterTemplateValues(encounter, userProfile);
  const template =
    encounter.scenario.openingMessage?.trim() || "Hello, {{user_name}}!";

  const fallback = userProfile?.displayName
    ? `Hello, ${userProfile.displayName}!`
    : "Hello!";

  const rendered = renderTemplate(template, values).trim();
  return rendered || fallback;
}
