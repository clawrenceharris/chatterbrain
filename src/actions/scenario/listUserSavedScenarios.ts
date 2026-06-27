"use server";

import { makeScenarioReadService } from "@/composition/scenario";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function listUserSavedScenarios(
  userId: string,
): Promise<ActionResult<ScenarioCardResult[]>> {
  const readService = makeScenarioReadService();
  const result = await readService.listSavedScenarioCardsByUserId(userId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
