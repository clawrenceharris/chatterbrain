import type { GamificationRepository } from "../../domain/repositories";
import { BadgeEvaluator } from "../../domain/services";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { GamificationSummaryAssembler } from "../assemblers/GamificationSummaryAssembler";
import type {
  GamificationSummaryOutput,
  RecordPracticeActivityResult,
} from "../dto";

type GetGamificationSummaryResult = Result<
  GamificationSummaryOutput,
  ApplicationError
>;
type RecordPracticeActivityUseCaseResult = Result<
  RecordPracticeActivityResult,
  ApplicationError
>;

export class GetGamificationSummaryUseCase {
  constructor(private readonly repository: GamificationRepository) {}

  async execute(userId: string): Promise<GetGamificationSummaryResult> {
    try {
      const snapshot = await this.repository.findActivitySnapshot(userId);
      return ok(GamificationSummaryAssembler.toSummaryOutput(snapshot));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class RecordPracticeActivityUseCase {
  constructor(private readonly repository: GamificationRepository) {}

  async execute(input: {
    userId: string;
    encounterId: string;
  }): Promise<RecordPracticeActivityUseCaseResult> {
    try {
      const snapshot = await this.repository.findActivitySnapshot(
        input.userId,
        input.encounterId,
      );
      const newlyUnlockedBadgeIds = BadgeEvaluator.evaluateNewBadges(snapshot);

      if (newlyUnlockedBadgeIds.length > 0) {
        await this.repository.updateEncounterUnlockedBadges(
          input.encounterId,
          newlyUnlockedBadgeIds,
        );
      }

      return ok({
        newlyUnlockedBadges: GamificationSummaryAssembler.toUnlockedBadges(
          newlyUnlockedBadgeIds,
        ),
      });
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
