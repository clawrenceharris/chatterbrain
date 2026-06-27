import type { ProgressReadRepository } from "../../domain/repositories";
import { ProgressAggregator } from "../../domain/services";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { ProgressPageAssembler } from "../assemblers/ProgressPageAssembler";
import type { ProgressPageOutput } from "../dto";

type GetProgressPageUseCaseResult = Result<
  ProgressPageOutput,
  ApplicationError
>;

export class GetProgressPageUseCase {
  constructor(private readonly repository: ProgressReadRepository) {}

  async execute(userId: string): Promise<GetProgressPageUseCaseResult> {
    try {
      const encounters =
        await this.repository.findCompletedEncountersWithReviewItems(userId);
      const aggregated = ProgressAggregator.aggregate(encounters);

      return ok(
        ProgressPageAssembler.toPageOutput({
          totalXp: aggregated.totalXp,
          encounters: aggregated.encounters,
          coreSkillXp: aggregated.coreSkillXp,
          strongestSkill: aggregated.strongestSkill,
          bestEncounter: aggregated.bestEncounter,
        }),
      );
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
