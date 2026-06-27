import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { ScenarioReadRepository } from "../../domain/repositories";
import type { ScenarioCardResult } from "../dto";

export type GetRelatedScenariosUseCaseResult = Result<
  ScenarioCardResult[],
  ApplicationError
>;

export class GetRelatedScenariosUseCase {
  constructor(private readonly scenarioRepository: ScenarioReadRepository) {}

  async execute(
    scenarioId: string,
    limit?: number,
  ): Promise<GetRelatedScenariosUseCaseResult> {
    try {
      const scenarios = await this.scenarioRepository.findRelatedScenarios(
        scenarioId,
        limit,
      );
      return ok(scenarios);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
