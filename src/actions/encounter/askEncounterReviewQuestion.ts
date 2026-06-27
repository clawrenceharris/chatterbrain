"use server";

import { makeAskEncounterReviewQuestionUseCase } from "@/composition/encounter";
import type {
  AskEncounterReviewQuestionActionInput,
  EncounterReviewChatAnswer,
} from "@/features/encounter/application/dto";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { getCurrentUser } from "../auth";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

export async function askEncounterReviewQuestion(
  input: AskEncounterReviewQuestionActionInput,
): Promise<ActionResult<EncounterReviewChatAnswer>> {
  const userResult = await getCurrentUser();
  if (!userResult.success) {
    return fail(userResult.error);
  }

  const userId = userResult.data?.id;
  if (!userId) {
    return fail(
      toActionError(
        new ApplicationError({ code: AppErrorCode.AUTH_UNAUTHENTICATED }),
      ),
    );
  }

  const useCase = makeAskEncounterReviewQuestionUseCase();
  const result = await useCase.execute({ ...input, userId });

  if (!result.success) {
    return fail(toActionError(result.error));
  }

  return ok(result.data);
}
