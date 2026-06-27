import type { EncounterStatus } from "@/features/encounter/domain/value-objects";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import type { EncounterCardResult } from "@/features/encounter/application/dto/EncounterCardResult";

export type HomePageEncounter = {
  id: string;
  title: string;
  startButtonLabel: string;
  actor: {
    displayName: string;
    avatarUrl: string | null;
  };
  scenario: {
    title: string;
    slug: string;
  };
  createdAt: string;
  status: {
    label: string;
    value: EncounterStatus;
  };
};

export type HomeTryNextVariant = "first_encounter" | "try_next";

export type HomePageTryNextSection = {
  variant: HomeTryNextVariant;
  title: string;
  scenario: ScenarioCardResult | null;
};

export type HomePageOutput = {
  continueEncounter: HomePageEncounter | null;
  tryNext: HomePageTryNextSection;
};

export type HomePageAssemblerInput = {
  encounters: EncounterCardResult[];
  suggestedScenario: ScenarioCardResult | null;
  tryNextVariant: HomeTryNextVariant;
};
