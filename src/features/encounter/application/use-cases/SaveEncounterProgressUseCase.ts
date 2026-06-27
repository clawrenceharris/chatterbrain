import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { EncounterRepository } from "../../domain/repositories";
import type { EncounterCardResult, SaveEncounterProgressInput } from "../dto";

export type SaveEncounterProgressUseCaseResult = Result<
  EncounterCardResult,
  ApplicationError
>;

export class SaveEncounterProgressUseCase {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async execute(
    input: SaveEncounterProgressInput,
  ): Promise<SaveEncounterProgressUseCaseResult> {
    try {
      const saved = await this.encounterRepository.saveProgress(input);
      return ok(saved);
    } catch (error) {
      console.error("Failed to save encounter progress", error);
      return fail(normalizeError(error));
    }
  }
}
