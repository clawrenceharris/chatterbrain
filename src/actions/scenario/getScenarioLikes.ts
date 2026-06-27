"use server";
import { makeScenarioReadService } from "@/composition/scenario";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ScenarioLike } from "@/features/scenario/domain/value-objects";

export async function getScenarioLikes(
  scenarioId: string,
): Promise<ActionResult<ScenarioLike[]>> {
  const readService = makeScenarioReadService();
  const result = await readService.getScenarioLikes(scenarioId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
