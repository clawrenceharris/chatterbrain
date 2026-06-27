import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { EncounterDetailResult } from "../dto";
import type { EncounterReadRepository } from "../../domain/repositories";

export type GetEncounterByIdUseCaseResult = Result<
  EncounterDetailResult | null,
  ApplicationError
>;

export class GetEncounterByIdUseCase {
  constructor(private readonly repository: EncounterReadRepository) {}

  async execute(id: string): Promise<GetEncounterByIdUseCaseResult> {
    try {
      return ok(await this.repository.findEncounterDetailById(id));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
