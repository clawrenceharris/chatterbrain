import { fail, ok, Result } from "@/shared/application";
import { EncounterDetailResult } from "../../application/dto";
import { EncounterReadRepository } from "../repositories";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { AppErrorCode } from "@/types/error.types";
import { EncounterCardResult } from "../../application/dto/EncounterCardResult";

export class EncounterReadService {
  async getEncountersByUserId(
    userId: string,
  ): Promise<Result<EncounterCardResult[]>> {
    try {
      const encounters =
        await this.encounterReadRepository.findEncountersByUserId(userId);
      return ok(encounters);
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "An unexpected error occurred while loading encounters",
        }),
      );
    }
  }
  constructor(
    private readonly encounterReadRepository: EncounterReadRepository,
  ) {}

  async listEncounters(): Promise<Result<EncounterCardResult[]>> {
    try {
      const encounters = await this.encounterReadRepository.findAllEncounters();
      return ok(encounters);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getEncounterCardByUserAndScenarioId(
    userId: string,
    scenarioId: string,
  ): Promise<Result<EncounterCardResult | null>> {
    try {
      const encounter =
        await this.encounterReadRepository.findEncounterCardByUserAndScenario(
          userId,
          scenarioId,
        );

      if (!encounter)
        return fail(
          new ApplicationError({
            code: AppErrorCode.RESOURCE_NOT_FOUND,
            message: "Encounter not found",
          }),
        );
      return ok(encounter);
    } catch (error) {
      console.error(error);
      return fail(normalizeError(error));
    }
  }
  async getEncounterDetail(id: string): Promise<Result<EncounterDetailResult>> {
    try {
      const encounter =
        await this.encounterReadRepository.findEncounterDetailById(id);
      console.log("encounter:", encounter);
      if (!encounter)
        return fail(
          new ApplicationError({ code: AppErrorCode.RESOURCE_NOT_FOUND }),
        );
      return ok(encounter);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
