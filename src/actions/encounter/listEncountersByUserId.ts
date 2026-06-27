"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { makeEncounterReadService } from "@/composition/encounter";
import { ListEncountersResult } from "@/features/encounter/application/dto/ListEncountersResult";
export async function listEncountersByUserId(
  userId: string,
): Promise<ActionResult<ListEncountersResult>> {
  const service = makeEncounterReadService();
  const result = await service.getEncountersByUserId(userId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
