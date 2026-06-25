"use server";
import { makeRequestPasswordResetUseCase } from "@/composition/auth";
import { ActionResult } from "@/shared/action";
import { toActionError } from "@/shared/action/toActionError";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function requestPasswordReset(
  email: string,
): Promise<ActionResult<void>> {
  try {
    const useCase = await makeRequestPasswordResetUseCase();
    const result = await useCase.execute(email);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(undefined);
  } catch (error) {
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}
