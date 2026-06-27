import { normalizeError } from "@/shared/utils/errors";
import { EncounterRepository } from "../../domain/repositories/EncounterRepository";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { UpdateEncounterValuesInput } from "../dto/UpdateEncounterValuesInput";

type UpdateEncounterValuesUseCaseResult = Result<void, ApplicationError>;
export class UpdateEncounterValuesUseCase {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async execute(
    input: UpdateEncounterValuesInput,
  ): Promise<UpdateEncounterValuesUseCaseResult> {
    try {
      await this.encounterRepository.updateEncounterValues(input);
      return ok(undefined);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
