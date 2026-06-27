import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { Encounter } from "../../domain/entities";
import { type EncounterRepository } from "../../domain/repositories";
import type {
  EncounterCardResult,
  CompleteEncounterSessionInput,
} from "../dto";
import { ConversationTurn } from "../../domain/value-objects";
import type { EncounterReviewPort } from "../../domain/services/EncounterReviewPort";

export type CompleteEncounterUseCaseResult = Result<
  EncounterCardResult,
  ApplicationError
>;

/**
 * Persist scores and mark session completed when dialogue machine finishes.
 */
export class CompleteEncounterUseCase {
  constructor(
    private readonly encounterRepository: EncounterRepository,
    private readonly encounterReviewPort: EncounterReviewPort,
  ) {}

  async execute(
    input: CompleteEncounterSessionInput,
  ): Promise<CompleteEncounterUseCaseResult> {
    try {
      const { userId, context } = input;

      const now = new Date().toISOString();
      const turns: ConversationTurn[] = context.conversationHistory.map(
        (turn, index) =>
          ({
            id: turn.id,
            encounterId: context.encounter.id,
            content: turn.content,
            createdAt: new Date(Date.now() + index).toISOString(),
            role: turn.speaker === "user" ? "user" : "actor",
            speakerId:
              turn.speaker === "user"
                ? context.userProfile.userId
                : context.encounter.actor.id,
            speakerName:
              turn.speaker === "user"
                ? (context.userProfile.displayName ??
                  context.userProfile.username)
                : context.encounter.actor.displayName,
          }) satisfies ConversationTurn,
      );
      const base = new Encounter({
        id: context.encounter.id,
        scenarioId: context.encounter.scenario.id,
        userId,
        status: "active",
        turns,
        variableValues: context.encounter.variableValues,
        summary: {},
        createdAt: now,
        actorId: context.encounter.actor.id,
        updatedAt: now,
      });

      const completed = base
        .withSummary(context.totalScores)
        .markCompleted(now);
      const review = await this.encounterReviewPort.generateReview({
        context,
        turns,
      });
      const saved = await this.encounterRepository.completeWithReview({
        encounter: completed,
        review,
      });
      return ok(saved);
    } catch (error) {
      console.error("Failed to save encounter progress", error);
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "Failed to save encounter progress",
        }),
      );
    }
  }
}
