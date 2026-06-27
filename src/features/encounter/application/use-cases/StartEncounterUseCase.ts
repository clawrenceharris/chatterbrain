import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { Encounter } from "../../domain/entities/Encounter";
import type { EncounterRepository } from "../../domain/repositories/EncounterRepository";
import type { StartEncounterInput } from "../dto/StartEncounterInput";
import { EncounterCardResult } from "../dto";

export type StartEncounterUseCaseResult = Result<
  EncounterCardResult,
  ApplicationError
>;

/**
 * Create a fresh encounter attempt before the XState machine starts.
 * Resume is handled by loading an existing encounter by id, not by mutating
 * a previous scenario attempt.
 */
export class StartEncounterUseCase {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async execute(
    input: StartEncounterInput,
  ): Promise<StartEncounterUseCaseResult> {
    try {
      const now = new Date().toISOString();
      const encounter = new Encounter({
        id: crypto.randomUUID(),
        scenarioId: input.scenarioId,
        userId: input.userId,
        actorId: input.actorId,
        variableValues: input.variableValues,
        status: "active",
        turns: [],
        summary: {},
        createdAt: now,
        updatedAt: now,
      });
      const saved = await this.encounterRepository.create(encounter);
      return ok(saved);
    } catch (error) {
      console.error("Failed to start encounter", error);
      return fail(normalizeError(error));
    }
  }
}
