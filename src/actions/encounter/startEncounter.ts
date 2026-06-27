"use server";

import { makeStartEncounterUseCase } from "@/composition/encounter";
import type { StartEncounterInput } from "@/features/encounter/application/dto/StartEncounterInput";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { getCurrentUser } from "../auth";

export async function startEncounter(
  input: Omit<StartEncounterInput, "userId">,
): Promise<ActionResult<{ id: string }>> {
  try {
    const useCase = makeStartEncounterUseCase();
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }
    const userId = userResult.data?.id;
    if (!userId) {
      return fail(toActionError(ApplicationError.unexpected("User not found")));
    }
    const result = await useCase.execute({ ...input, userId });
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok({ id: result.data.id });
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
