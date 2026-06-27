import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { EncounterReadRepository } from "../../domain/repositories";
import { EncounterResultsPageOutput } from "../dto/EncounterResultsPageDto";
import { fail, ok, Result } from "@/shared/application";
import { AppErrorCode } from "@/types/error.types";
import { EncounterResultsPageAssembler } from "../assemblers";

type GetEncounterResultsPageUseCaseResult = Result<
  EncounterResultsPageOutput,
  ApplicationError
>;
export class GetEncounterResultsPageUseCase {
  constructor(private readonly encounterRepository: EncounterReadRepository) {}

  async execute(
    encounterId: string,
  ): Promise<GetEncounterResultsPageUseCaseResult> {
    try {
      const encounter =
        await this.encounterRepository.findEncounterResults(encounterId);
      if (!encounter) {
        return fail(
          new ApplicationError({ code: AppErrorCode.RESOURCE_NOT_FOUND }),
        );
      }
      return ok(EncounterResultsPageAssembler.toPageOutput({ encounter }));
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message:
            "An error occurred while loading the results of this encounter.",
        }),
      );
    }
  }
}
