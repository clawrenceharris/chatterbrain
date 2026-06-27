import type { EncounterMachineContext } from "../../domain/types";

/** Payload when XState reaches `completed` */
export interface CompleteEncounterSessionInput {
  userId: string;
  context: EncounterMachineContext;
}
