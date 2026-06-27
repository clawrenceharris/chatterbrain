import { fail, ok, Result } from "@/shared/application";
import { ScenarioRepository } from "../../domain/repositories/ScenarioRepository";
import { SaveScenarioInput } from "../dto/SaveScenarioInput";
import { ApplicationError, normalizeError } from "@/shared/utils";

type SaveScenarioUseCaseResult = Result<void, ApplicationError>;
export class SaveScenarioUseCase {
  constructor(private readonly scenarioRepository: ScenarioRepository) {}

  async execute(input: SaveScenarioInput): Promise<SaveScenarioUseCaseResult> {
    try {
      const isSaved = await this.scenarioRepository.getScenarioSave(
        input.userId,
        input.scenarioId,
      );
      if (isSaved) {
        await this.scenarioRepository.removeScenarioSave(
          input.userId,
          input.scenarioId,
        );
      } else {
        await this.scenarioRepository.addScenarioSave(
          input.userId,
          input.scenarioId,
        );
      }
      return ok(undefined);
    } catch (error) {
      console.error("Failed to save scenario", error);
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "Failed to save scenario",
        }),
      );
    }
  }
}
