"use server";

import { makeScenarioReadService } from "@/composition/scenario";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import type { ListScenariosResult } from "@/features/scenario/application/dto";

export async function listScenarios(): Promise<
  ActionResult<ListScenariosResult>
> {
  try {
    const service = makeScenarioReadService();
    const result = await service.listScenarios();
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
