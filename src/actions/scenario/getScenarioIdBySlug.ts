"use server";

import { makeScenarioReadService } from "../../composition/scenario";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function getScenarioIdBySlug(
  slug: string,
): Promise<ActionResult<string | null>> {
  const readService = makeScenarioReadService();
  const result = await readService.getScenarioBySlug(slug);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data?.id ?? null);
}
