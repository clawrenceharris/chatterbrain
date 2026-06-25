"use server";
import { makeResetPasswordUseCase } from "@/composition/auth";
import { toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
export async function resetPassword(newPassword: string) {
  try {
    const useCase = await makeResetPasswordUseCase();
    const result = await useCase.execute(newPassword);
    if (!result.success) return fail(toActionError(result.error));
    return ok(undefined);
  } catch (error) {
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}
