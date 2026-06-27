"use server";

import { makeGetScenarioDetailPageUseCase } from "@/composition/scenario";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import type { ScenarioDetailPageOutput } from "@/features/scenario/application/dto";
import { getCurrentUser } from "../auth";
import { AppErrorCode } from "@/types";

export async function getScenarioDetailPage(
  scenarioId: string,
): Promise<ActionResult<ScenarioDetailPageOutput | null>> {
  try {
    const useCase = makeGetScenarioDetailPageUseCase();
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
    const userId = userResult.data.id;
    const result = await useCase.execute(scenarioId, userId);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
