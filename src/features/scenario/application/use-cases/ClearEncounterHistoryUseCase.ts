import { getCurrentUser } from "@/actions/auth";
import { ScenarioRepository } from "../../domain/repositories/ScenarioRepository";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils";

type ClearEncounterHistoryUseCaseResult = Result<void, ApplicationError>;
export class ClearEncounterHistoryUseCase {
  constructor(private readonly scenarioRepository: ScenarioRepository) {}

  async execute({
    scenarioId,
  }: {
    scenarioId: string;
  }): Promise<ClearEncounterHistoryUseCaseResult> {
    try {
      const userResult = await getCurrentUser();
      if (!userResult.success) {
        return fail(normalizeError(userResult.error));
      }
      const userId = userResult.data?.id;
      if (!userId) {
        return fail(ApplicationError.unexpected("User not found"));
      }
      await this.scenarioRepository.clearEncounterHistory(scenarioId, userId);
      return ok(undefined);
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "Failed to clear history",
        }),
      );
    }
  }
}
