"use server";

import { makeListActorsUseCase } from "@/composition/actor";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import type { ActorListItemResult } from "@/features/actor/application/dto";

export async function listActors(): Promise<
  ActionResult<ActorListItemResult[]>
> {
  try {
    const useCase = makeListActorsUseCase();
    const result = await useCase.execute();
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
