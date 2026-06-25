"use server";

import {
  CompleteOnboardingInput,
  CompleteOnboardingResult,
} from "@/features/onboarding/application/dto";
import { makeCompleteOnboardingUseCase } from "@/composition/onboarding";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export async function completeOnboardingAction(
  input: CompleteOnboardingInput,
): Promise<ActionResult<CompleteOnboardingResult>> {
  try {
    const useCase = makeCompleteOnboardingUseCase();
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
