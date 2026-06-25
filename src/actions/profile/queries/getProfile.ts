"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { makeProfileReadService } from "@/composition/profile";
import { fail, ok } from "@/shared/application";
import {
  ProfileDetailResult,
  ProfileCardResult,
} from "@/features/profile/application/dto";

export async function getProfile(
  userId: string,
): Promise<ActionResult<ProfileCardResult | null>> {
  const service = makeProfileReadService();
  const result = await service.getProfileCard(userId);
  if (!result.success) return fail(toActionError(result.error));

  return ok(result.data);
}

export async function getProfileDetail(
  userId: string,
): Promise<ActionResult<ProfileDetailResult | null>> {
  const result = await makeProfileReadService().getProfileDetail(userId);
  if (!result.success) return fail(toActionError(result.error));
  return ok(result.data);
}

export async function getProfileCard(
  userId: string,
): Promise<ActionResult<ProfileCardResult | null>> {
  const service = makeProfileReadService();
  const result = await service.getProfileCard(userId);
  if (!result.success) return fail(toActionError(result.error));

  return ok(result.data);
}
