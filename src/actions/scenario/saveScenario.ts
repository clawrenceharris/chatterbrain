"use server";
import { makeSaveScenarioUseCase } from "@/composition/scenario/makeSaveScenarioUseCase";
import { SaveScenarioInput } from "@/features/scenario/application/dto";
import { toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function saveScenario(input: SaveScenarioInput) {
  const saveScenarioUseCase = makeSaveScenarioUseCase();
  const result = await saveScenarioUseCase.execute(input);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
