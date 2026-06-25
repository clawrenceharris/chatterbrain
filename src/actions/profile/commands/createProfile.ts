"use server";
import {
  CreateProfileInput,
  CreateProfileResult,
} from "@/features/profile/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { makeCreateProfileUseCase } from "@/composition/profile";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function createProfileAction(
  input: CreateProfileInput,
): Promise<ActionResult<CreateProfileResult>> {
  try {
    const useCase = await makeCreateProfileUseCase();
    const result = await useCase.execute(input);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}
