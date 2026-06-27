import { EncounterStatus } from "@/types";

export const ENCOUNTER_STATUS_LABELS: Record<EncounterStatus, string> = {
  [EncounterStatus.NOT_STARTED]: "Not started",
  [EncounterStatus.IN_PROGRESS]: "In progress",
  [EncounterStatus.COMPLETED]: "Completed",
  [EncounterStatus.ABANDONED]: "Abandoned",
};
