import { EncounterStatus } from "../../domain/value-objects";

export type EncounterCardResult = {
  id: string;
  title: string;
  status: {
    label: string;
    value: EncounterStatus;
  };
  createdAt: string;
  scenario: {
    id: string;
    title: string;
    slug: string;
  };
  actor: {
    role: string;
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
};
