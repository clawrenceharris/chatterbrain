import type { UnlockedBadge } from "@/features/gamification/application/dto";
import type { EncounterCardResult } from "./EncounterCardResult";

export type CompleteEncounterOutput = {
  encounter: EncounterCardResult;
  newlyUnlockedBadges: UnlockedBadge[];
};
