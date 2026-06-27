import { fail, ok, Result } from "@/shared/application";
import { ScenarioRepository } from "../../domain/repositories";
import { LikeScenarioInput } from "../dto";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { ScenarioLike } from "../../domain/value-objects";

type LikeScenarioUseCaseResult = Result<ScenarioLike | null, ApplicationError>;
export class LikeScenarioUseCase {
  constructor(private readonly scenarioRepository: ScenarioRepository) {}

  async execute(input: LikeScenarioInput): Promise<LikeScenarioUseCaseResult> {
    try {
      const isLiked = await this.scenarioRepository.getScenarioLike(
        input.userId,
        input.scenarioId,
      );
      if (isLiked) {
        await this.scenarioRepository.removeScenarioLike(
          input.userId,
          input.scenarioId,
        );
        return ok(null);
      }
      const like = await this.scenarioRepository.addScenarioLike(
        input.userId,
        input.scenarioId,
      );
      return ok(like);
    } catch (error) {
      console.error("Failed to like scenario", error);
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "Failed to like scenario",
        }),
      );
    }
  }
}
