"use server";

import { getCurrentUser } from "@/actions/auth";
import { makeDeleteEncounterByIdUseCase } from "@/composition/encounter";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { DeleteEncounterResult } from "../../features/encounter/application/dto";

export async function deleteEncounterById(
  encounterId: string,
): Promise<ActionResult<DeleteEncounterResult>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }

    const userId = userResult.data?.id;
    if (!userId) {
      return fail(toActionError(ApplicationError.unexpected("User not found")));
    }

    const useCase = makeDeleteEncounterByIdUseCase();
    const result = await useCase.execute({ encounterId, userId });
    if (!result.success) {
      return fail(toActionError(result.error));
    }

    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
