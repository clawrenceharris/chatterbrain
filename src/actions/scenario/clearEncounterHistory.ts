"use server";
import { fail, ok } from "@/shared/application";
import { makeClearEncounterHistoryUseCase } from "@/composition/scenario";
import { toActionError } from "@/shared/action";
import { ApplicationError } from "@/shared/utils";
export async function clearEncounterHistory(scenarioId: string) {
  try {
    const service = makeClearEncounterHistoryUseCase();
    const result = await service.execute({ scenarioId });
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(undefined);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
