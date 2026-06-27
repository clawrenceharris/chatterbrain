"use server";
import { makeActorReadService } from "@/composition/actor/makeActorReadService";
import { ActorDetailResult } from "@/features/actor/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function getActorDetailById(
  actorId: string,
): Promise<ActionResult<ActorDetailResult | null>> {
  try {
    const service = makeActorReadService();
    const result = await service.getActorDetailById(actorId);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return ok(result.data);
  } catch (error) {
    console.error("Error getting actor by id", error);
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
