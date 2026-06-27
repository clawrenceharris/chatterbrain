"use server";

import { makeDomainReadService } from "@/composition/domain";
import type { DomainCardResult } from "@/features/domain/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export async function listDomains(): Promise<ActionResult<DomainCardResult[]>> {
  try {
    const service = makeDomainReadService();
    const result = await service.listDomains();
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
