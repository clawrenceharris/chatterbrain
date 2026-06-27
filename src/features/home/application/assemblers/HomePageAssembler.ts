import type { EncounterCardResult } from "@/features/encounter/application/dto/EncounterCardResult";
import type { EncounterStatus } from "@/features/encounter/domain/value-objects";
import type {
  HomePageAssemblerInput,
  HomePageEncounter,
  HomePageOutput,
  HomeTryNextVariant,
} from "../dto";

const UNFINISHED_STATUSES = new Set<EncounterStatus>(["active"]);

function getStartButtonLabel(status: EncounterStatus): string {
  return status === "completed" ? "Start New Encounter" : "Resume Encounter";
}

function toHomePageEncounter(
  encounter: EncounterCardResult,
): HomePageEncounter {
  return {
    id: encounter.id,
    title: encounter.title,
    startButtonLabel: getStartButtonLabel(encounter.status.value),
    actor: {
      displayName: encounter.actor.displayName,
      avatarUrl: encounter.actor.avatarUrl,
    },
    scenario: {
      title: encounter.scenario.title,
      slug: encounter.scenario.slug,
    },
    createdAt: encounter.createdAt,
    status: encounter.status,
  };
}

function getTryNextTitle(variant: HomeTryNextVariant): string {
  return variant === "first_encounter"
    ? "Start your first encounter"
    : "Try next";
}

export class HomePageAssembler {
  static toPageOutput(input: HomePageAssemblerInput): HomePageOutput {
    const sortedEncounters = [...input.encounters].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );

    const continueEncounter =
      sortedEncounters.find((encounter) =>
        UNFINISHED_STATUSES.has(encounter.status.value),
      ) ?? null;

    return {
      continueEncounter: continueEncounter
        ? toHomePageEncounter(continueEncounter)
        : null,
      tryNext: {
        variant: input.tryNextVariant,
        title: getTryNextTitle(input.tryNextVariant),
        scenario: input.suggestedScenario,
      },
    };
  }
}
