import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { EncounterRepository } from "../../domain/repositories/EncounterRepository";
import type { EncounterCardResult } from "../dto/EncounterCardResult";
import type { ReplayEncounterInput } from "../dto/ReplayEncounterInput";

export type ReplayEncounterUseCaseResult = Result<
  EncounterCardResult,
  ApplicationError
>;

export class ReplayEncounterUseCase {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async execute(
    input: ReplayEncounterInput,
  ): Promise<ReplayEncounterUseCaseResult> {
    try {
      const replayed = await this.encounterRepository.replay(input);
      return ok(replayed);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
