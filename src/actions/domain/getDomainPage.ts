"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import type { DomainPageOutput } from "@/features/domain/application/dto";
import { makeGetDomainPageUseCase } from "@/composition/domain";

export async function getDomainPage(
  slug: string,
): Promise<ActionResult<DomainPageOutput>> {
  const useCase = makeGetDomainPageUseCase();
  const result = await useCase.execute(slug);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
