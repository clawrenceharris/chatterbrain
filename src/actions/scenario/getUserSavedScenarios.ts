"use server";

import { makeScenarioReadService } from "@/composition/scenario";
import { ScenarioSave } from "@/features/scenario/domain/value-objects";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function getUserSavedScenarios(
  scenarioId: string,
): Promise<ActionResult<ScenarioSave[]>> {
  const readService = makeScenarioReadService();
  const result = await readService.getScenarioSavesByUser(scenarioId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
