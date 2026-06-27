"use server";

import { getCurrentUser } from "@/actions/auth";
import { makeGetGamificationSummaryUseCase } from "@/composition/gamification";
import type { GamificationSummaryOutput } from "@/features/gamification/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

export async function getGamificationSummary(): Promise<
  ActionResult<GamificationSummaryOutput>
> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }
    if (!userResult.data) {
      return fail(
        toActionError(
          new ApplicationError({ code: AppErrorCode.AUTH_USER_NOT_FOUND }),
        ),
      );
    }

    const useCase = makeGetGamificationSummaryUseCase();
    const result = await useCase.execute(userResult.data.id);
    if (!result.success) {
      return fail(toActionError(result.error));
    }

    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
