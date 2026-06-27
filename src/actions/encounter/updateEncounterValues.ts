"use server";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import type { UpdateEncounterValuesInput } from "@/features/encounter/application/dto";
import { makeUpdateEncounterValuesUseCase } from "@/composition/encounter";

export async function updateEncounterValues(
  input: UpdateEncounterValuesInput,
): Promise<ActionResult<void>> {
  try {
    const useCase = makeUpdateEncounterValuesUseCase();
    const result = await useCase.execute(input);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(undefined);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
