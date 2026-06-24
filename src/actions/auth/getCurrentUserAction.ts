"use server";
import { User } from "@supabase/supabase-js";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { makeGetCurrentUserUseCase } from "@/composition/auth";

export async function getCurrentUser(): Promise<ActionResult<User | null>> {
    const useCase = await makeGetCurrentUserUseCase();
    const result = await useCase.execute();
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
}