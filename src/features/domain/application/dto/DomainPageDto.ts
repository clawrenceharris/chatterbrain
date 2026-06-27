import { EncounterStatus } from "@/features/encounter/domain/value-objects";
import { DomainCardResult } from "./DomainCardResult";

export type DomainPageScenario = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  focusSkills: string[];
  imageUrl: string | null;
  hasActiveEncounter: boolean;
  actor: {
    role: string;
    id: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  shortDescription: string | null;
};
export type DomainPageEncounter = {
  id: string;
  title: string;
  startButtonLabel: string;
  actor: {
    role: string;
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  scenario: {
    id: string;
    title: string;
    slug: string;
  };
  createdAt: string;
  status: {
    label: string;
    value: EncounterStatus;
  };
};
export type DomainPageOutput = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  scenarios: DomainPageScenario[];
  encounters: DomainPageEncounter[];
  relatedDomains: DomainCardResult[];
};
