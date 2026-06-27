import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { EncounterRepository } from "../../domain/repositories";
import type { DeleteEncounterByIdInput, DeleteEncounterResult } from "../dto";

export type DeleteEncounterByIdUseCaseResult = Result<
  DeleteEncounterResult,
  ApplicationError
>;

export class DeleteEncounterByIdUseCase {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async execute(
    input: DeleteEncounterByIdInput,
  ): Promise<DeleteEncounterByIdUseCaseResult> {
    try {
      const result = await this.encounterRepository.deleteById(input);
      return ok(result);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
