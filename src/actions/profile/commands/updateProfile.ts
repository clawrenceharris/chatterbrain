"use server";
import {
  UpdateProfileInput,
  UpdateProfileResult,
} from "@/features/profile/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { makeUpdateProfileUseCase } from "@/composition/profile";
import { fail, ok } from "@/shared/application";
import { toActionError, ActionResult } from "@/shared/action";
import { AppErrorCode } from "@/types";
import { getCurrentUser } from "../../auth";
import { updateProfileSchema } from "@/lib/validation/profile";

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<ActionResult<UpdateProfileResult>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }
    if (userResult.data?.id !== input.userId) {
      return fail(
        new ApplicationError({ code: AppErrorCode.PERMISSION_DENIED }),
      );
    }

    const { error } = updateProfileSchema.safeParse(input);
    if (error) {
      return fail(
        toActionError(
          new ApplicationError({
            code: AppErrorCode.VALIDATION_FAILED,
            message: error.message,
          }),
        ),
      );
    }
    const useCase = await makeUpdateProfileUseCase();

    const result = await useCase.execute(input);

    if (!result.success) {
      return fail(result.error);
    }
    return ok(result.data);
  } catch (error) {
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}
