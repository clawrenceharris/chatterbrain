"use server";

import { makeGetEncounterResultsPageUseCase } from "@/composition/encounter";
import { EncounterResultsPageOutput } from "@/features/encounter/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function getEncounterResultsPage(
  encounterId: string,
): Promise<ActionResult<EncounterResultsPageOutput | null>> {
  const useCase = makeGetEncounterResultsPageUseCase();
  const result = await useCase.execute(encounterId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
