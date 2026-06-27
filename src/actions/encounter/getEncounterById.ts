"use server";

import { makeEncounterReadService } from "@/composition/encounter";
import { EncounterDetailResult } from "@/features/encounter/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export async function getEncounterById(
  id: string,
): Promise<ActionResult<EncounterDetailResult | null>> {
  try {
    const service = makeEncounterReadService();
    const result = await service.getEncounterDetail(id);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
