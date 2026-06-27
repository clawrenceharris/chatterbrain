"use server";

import { makeCompleteEncounterUseCase } from "@/composition/encounter";
import { makeRecordPracticeActivityUseCase } from "@/composition/gamification";
import type {
  CompleteEncounterOutput,
  CompleteEncounterSessionInput,
} from "@/features/encounter/application/dto";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { getCurrentUser } from "../auth";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

export async function completeEncounter(
  input: CompleteEncounterSessionInput,
): Promise<ActionResult<CompleteEncounterOutput>> {
  const userResult = await getCurrentUser();
  if (!userResult.success) {
    return fail(userResult.error);
  }

  const userId = userResult.data?.id;
  if (!userId || userId !== input.userId) {
    return fail(
      toActionError(
        new ApplicationError({ code: AppErrorCode.PERMISSION_DENIED }),
      ),
    );
  }

  const useCase = makeCompleteEncounterUseCase();
  const result = await useCase.execute(input);
  if (!result.success) {
    return fail(toActionError(result.error));
  }

  const recordActivity = makeRecordPracticeActivityUseCase();
  const activityResult = await recordActivity.execute({
    userId,
    encounterId: input.context.encounter.id,
  });

  return ok({
    encounter: result.data,
    newlyUnlockedBadges: activityResult.success
      ? activityResult.data.newlyUnlockedBadges
      : [],
  });
}
