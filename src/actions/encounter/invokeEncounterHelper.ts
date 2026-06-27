"use server";

import { makeInvokeEncounterHelperUseCase } from "@/composition/encounter/makeInvokeEncounterHelperUseCase";
import type {
  InvokeEncounterHelperActionInput,
  InvokeEncounterHelperOutput,
} from "@/features/encounter/application/dto/InvokeEncounterHelperDto";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { getCurrentUser } from "../auth";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

export async function invokeEncounterHelper(
  input: InvokeEncounterHelperActionInput,
): Promise<ActionResult<InvokeEncounterHelperOutput>> {
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

  const useCase = makeInvokeEncounterHelperUseCase();
  const result = await useCase.execute({ ...input, userId });

  if (!result.success) {
    return fail(toActionError(result.error));
  }

  return ok(result.data);
}
