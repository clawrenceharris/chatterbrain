import type { EncounterReadRepository } from "@/features/encounter/domain/repositories";
import type { ScenarioReadRepository } from "@/features/scenario/domain/repositories";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { HomePageAssembler } from "../assemblers/HomePageAssembler";
import type { HomePageOutput } from "../dto";

type GetHomePageUseCaseResult = Result<HomePageOutput, ApplicationError>;

const RECENT_ENCOUNTER_LIMIT = 3;

export class GetHomePageUseCase {
  constructor(
    private readonly encounterRepository: EncounterReadRepository,
    private readonly scenarioRepository: ScenarioReadRepository,
  ) {}

  async execute(userId: string): Promise<GetHomePageUseCaseResult> {
    try {
      const encounters =
        await this.encounterRepository.findEncountersByUserId(userId);
      const startedScenarioIds = new Set(
        encounters.map((encounter) => encounter.scenario.id),
      );

      if (encounters.length === 0) {
        const suggestedScenario =
          await this.findFirstUnstartedScenario(startedScenarioIds);

        return ok(
          HomePageAssembler.toPageOutput({
            encounters,
            suggestedScenario,
            tryNextVariant: "first_encounter",
          }),
        );
      }

      const suggestedScenario = await this.findSuggestedScenario(
        encounters,
        startedScenarioIds,
      );

      return ok(
        HomePageAssembler.toPageOutput({
          encounters,
          suggestedScenario,
          tryNextVariant: "try_next",
        }),
      );
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  private async findSuggestedScenario(
    encounters: Awaited<
      ReturnType<EncounterReadRepository["findEncountersByUserId"]>
    >,
    startedScenarioIds: Set<string>,
  ): Promise<ScenarioCardResult | null> {
    const recentScenarioIds = [...encounters]
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )
      .slice(0, RECENT_ENCOUNTER_LIMIT)
      .map((encounter) => encounter.scenario.id);

    const seenScenarioIds = new Set<string>();

    for (const scenarioId of recentScenarioIds) {
      const relatedScenarios =
        await this.scenarioRepository.findRelatedScenarios(scenarioId, 5);

      for (const scenario of relatedScenarios) {
        if (seenScenarioIds.has(scenario.id)) continue;
        seenScenarioIds.add(scenario.id);

        if (!startedScenarioIds.has(scenario.id)) {
          return scenario;
        }
      }
    }

    return this.findFirstUnstartedScenario(startedScenarioIds);
  }

  private async findFirstUnstartedScenario(
    startedScenarioIds: Set<string>,
  ): Promise<ScenarioCardResult | null> {
    const scenarios = await this.scenarioRepository.listScenarioCards();
    return (
      scenarios.find((scenario) => !startedScenarioIds.has(scenario.id)) ??
      scenarios[0] ??
      null
    );
  }
}
