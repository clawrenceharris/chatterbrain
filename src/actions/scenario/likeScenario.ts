"use server";
import { makeLikeScenarioUseCase } from "@/composition/scenario/makeLikeScenarioUseCase";
import { LikeScenarioInput } from "@/features/scenario/application/dto";
import { ScenarioLike } from "@/features/scenario/domain/value-objects";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
export async function likeScenario(
  input: LikeScenarioInput,
): Promise<ActionResult<ScenarioLike | null>> {
  const likeScenarioUseCase = makeLikeScenarioUseCase();
  const result = await likeScenarioUseCase.execute(input);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
