"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import type {
  EncounterPageOutput,
  GetEncounterPageInput,
} from "@/features/encounter/application/dto";
import { makeGetEncounterPageUseCase } from "@/composition/encounter";

export async function getEncounterPage(
  input: GetEncounterPageInput,
): Promise<ActionResult<EncounterPageOutput | null>> {
  const useCase = makeGetEncounterPageUseCase();
  const result = await useCase.execute(input);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
