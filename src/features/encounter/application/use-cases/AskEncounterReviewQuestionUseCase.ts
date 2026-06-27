import { fail, ok, type Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";
import type {
  AskEncounterReviewQuestionInput,
  EncounterReviewChatAnswer,
  EncounterReviewChatMessage,
} from "../dto";
import type { EncounterReadRepository } from "../../domain/repositories";
import type { EncounterReviewChatPort } from "../../domain/services";

type AskEncounterReviewQuestionUseCaseResult = Result<
  EncounterReviewChatAnswer,
  ApplicationError
>;

const MAX_QUESTION_LENGTH = 800;
const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_MESSAGE_LENGTH = 1000;

export class AskEncounterReviewQuestionUseCase {
  constructor(
    private readonly encounterRepository: EncounterReadRepository,
    private readonly reviewChatPort: EncounterReviewChatPort,
  ) {}

  async execute(
    input: AskEncounterReviewQuestionInput,
  ): Promise<AskEncounterReviewQuestionUseCaseResult> {
    const question = input.question.trim();
    if (!question || question.length > MAX_QUESTION_LENGTH) {
      return fail(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Ask a shorter question about this review.",
        }),
      );
    }

    try {
      const context =
        await this.encounterRepository.findEncounterReviewChatContext(
          input.encounterId,
          input.userId,
        );

      if (!context) {
        return fail(
          new ApplicationError({ code: AppErrorCode.RESOURCE_NOT_FOUND }),
        );
      }

      const answer = await this.reviewChatPort.answerQuestion({
        context,
        question,
        history: this.sanitizeHistory(input.history ?? []),
      });

      return ok(answer);
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "An error occurred while answering this review question.",
        }),
      );
    }
  }

  private sanitizeHistory(
    history: EncounterReviewChatMessage[],
  ): EncounterReviewChatMessage[] {
    return history
      .filter(
        (message) => message.role === "user" || message.role === "assistant",
      )
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, MAX_HISTORY_MESSAGE_LENGTH),
      }))
      .filter((message) => message.content.length > 0);
  }
}
