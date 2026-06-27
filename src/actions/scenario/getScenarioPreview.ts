"use server";
import { makeGetScenarioPreviewUseCase } from "@/composition/scenario";
import { ScenarioPreviewOutput } from "@/features/scenario/application/dto/ScenarioPreviewDto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function getScenarioPreview(
  scenarioId: string,
  userId: string,
): Promise<ActionResult<ScenarioPreviewOutput | null>> {
  const useCase = makeGetScenarioPreviewUseCase();
  const result = await useCase.execute(scenarioId, userId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
