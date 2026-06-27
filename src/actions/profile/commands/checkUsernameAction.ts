"use server";
import { makeCheckUsernameAvailabilityUseCase } from "@/composition/profile";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { CheckUsernameResult } from "@/features/profile/application/dto";

export async function checkUsernameAction(
  username: string,
  userId: string,
): Promise<ActionResult<CheckUsernameResult>> {
  const useCase = makeCheckUsernameAvailabilityUseCase();
  const result = await useCase.execute(username, userId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
