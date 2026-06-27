import type { ScenarioReadRepository } from "../../domain/repositories";
import { ScenarioPreviewAssembler } from "../assemblers";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { ScenarioPreviewOutput } from "../dto/ScenarioPreviewDto";
import { AppErrorCode } from "@/types";
import { ProfileReadRepository } from "@/features/profile/domain/repositories";

type GetScenarioPreviewUseCaseResult = Result<
  ScenarioPreviewOutput,
  ApplicationError
>;
export class GetScenarioPreviewUseCase {
  constructor(
    private readonly scenarioRepository: ScenarioReadRepository,
    private readonly profileRepository: ProfileReadRepository,
  ) {}

  async execute(
    scenarioId: string,
    userId: string,
  ): Promise<GetScenarioPreviewUseCaseResult> {
    try {
      const [scenario, user] = await Promise.all([
        this.scenarioRepository.findScenarioPreviewById(scenarioId),
        this.profileRepository.findProfileCardById(userId),
      ]);
      if (!scenario) {
        return fail(
          new ApplicationError({
            code: AppErrorCode.RESOURCE_NOT_FOUND,
            message: "Scenario not found",
          }),
        );
      }
      if (!user) {
        return fail(
          new ApplicationError({
            code: AppErrorCode.RESOURCE_NOT_FOUND,
            message: "User not found",
          }),
        );
      }
      return ok(ScenarioPreviewAssembler.toPreviewOutput(scenario, user));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
