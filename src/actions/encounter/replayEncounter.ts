"use server";

import { getCurrentUser } from "@/actions/auth";
import { makeReplayEncounterUseCase } from "@/composition/encounter";
import type { EncounterCardResult } from "@/features/encounter/application/dto/EncounterCardResult";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export async function replayEncounter(
  encounterId: string,
): Promise<ActionResult<EncounterCardResult>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }

    const userId = userResult.data?.id;
    if (!userId) {
      return fail(toActionError(ApplicationError.unexpected("User not found")));
    }

    const useCase = makeReplayEncounterUseCase();
    const result = await useCase.execute({ encounterId, userId });
    if (!result.success) {
      return fail(toActionError(result.error));
    }

    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
