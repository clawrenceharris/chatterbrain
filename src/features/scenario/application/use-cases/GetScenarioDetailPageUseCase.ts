import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import type { ScenarioReadRepository } from "../../domain/repositories";
import type { ScenarioDetailPageOutput } from "../dto";
import {
  ScenarioDetailPageAssembler,
  type ScenarioDetailPageActor,
} from "../assemblers";

export type GetScenarioDetailPageUseCaseResult = Result<
  ScenarioDetailPageOutput | null,
  ApplicationError
>;

export interface ScenarioDetailPageActorRepository {
  findDefaultActor(scenarioId: string): Promise<ScenarioDetailPageActor | null>;
  findById(actorId: string): Promise<ScenarioDetailPageActor | null>;
}

export class GetScenarioDetailPageUseCase {
  constructor(
    private readonly scenarioRepository: ScenarioReadRepository,
    private readonly actorRepository: ScenarioDetailPageActorRepository,
  ) {}

  async execute(
    scenarioId: string,
    userId: string,
  ): Promise<GetScenarioDetailPageUseCaseResult> {
    try {
      const scenario =
        await this.scenarioRepository.findScenarioDetailByIdForUser(
          scenarioId,
          userId,
        );
      if (!scenario) {
        return ok(null);
      }
      const [likes, saves, actor] = await Promise.all([
        this.scenarioRepository.findScenarioLikes(scenario.id),
        this.scenarioRepository.findScenarioSavesByUser(scenario.id, userId),
        this.actorRepository.findDefaultActor(scenario.id),
      ]);

      return ok(
        ScenarioDetailPageAssembler.toPageOutput(scenario, likes, saves, actor),
      );
    } catch (error) {
      console.error(error);
      return fail(normalizeError(error));
    }
  }
}
