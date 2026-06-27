"use server";

import { makeAskChitterUseCase } from "@/composition/ai";
import type {
  AskChitterActionInput,
  AskChitterOutput,
} from "@/features/ai/application";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { getCurrentUser } from "../auth";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

export async function askChitter(
  input: AskChitterActionInput,
): Promise<ActionResult<AskChitterOutput>> {
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

  const useCase = makeAskChitterUseCase();
  const result = await useCase.execute({ ...input, userId });
  if (!result.success) {
    return fail(toActionError(result.error));
  }

  return ok(result.data);
}
