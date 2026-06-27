export interface StartEncounterInput {
  userId: string;
  scenarioId: string;
  actorId: string;
  variableValues?: Record<string, unknown> | null;
}
