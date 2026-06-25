"use server"

import { makeLoginUserUseCase } from "@/composition/auth";
import { loginSchema , type LoginFormValues } from "@/lib/validation/auth";
import { AppErrorCode } from "@/types/error.types";
import { User } from "@supabase/supabase-js";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function loginAction(input: LoginFormValues): Promise<ActionResult<User>> {
    const {data, success, error} = loginSchema.safeParse(input);
  
    if (!success) {
      const appError = new ApplicationError({ code: AppErrorCode.VALIDATION_FAILED, message: error.issues[0].message });
      return fail(toActionError(appError));
    }
  
    try {
      const { email, password } = data;
      const useCase = await makeLoginUserUseCase();
      const result = await useCase.execute(email, password);
      if (!result.success) {
        return fail(toActionError(result.error));
      }
      return ok(result.data);
    } catch (error) {
      console.error("Unexpected login action error:", error);
      const appError = ApplicationError.unexpected(error);
      return fail(toActionError(appError));
    }
  }