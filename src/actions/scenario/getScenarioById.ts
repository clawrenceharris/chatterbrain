"use server";

import { makeScenarioReadService } from "@/composition/scenario";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import type { ScenarioDetailResult } from "@/features/scenario/application/dto";

export async function getScenarioById(
  scenarioId: string,
): Promise<ActionResult<ScenarioDetailResult | null>> {
  try {
    const service = makeScenarioReadService();
    const result = await service.getScenarioDetailById(scenarioId);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
