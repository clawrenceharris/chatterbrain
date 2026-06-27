"use server";

import { makeGetRelatedScenariosUseCase } from "@/composition/scenario";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export async function getRelatedScenarios(
  scenarioId: string,
  limit?: number,
): Promise<ActionResult<ScenarioCardResult[]>> {
  try {
    const useCase = makeGetRelatedScenariosUseCase();
    const result = await useCase.execute(scenarioId, limit);
    if (!result.success) {
      return fail(toActionError(result.error));
    }

    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
