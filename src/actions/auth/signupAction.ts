"use server"
import { makeSignupUserUseCase } from "@/composition/auth";
import { signUpSchema , type SignUpFormValues } from "@/lib/validation/auth";
import { AppErrorCode } from "@/types";
import { User } from "@supabase/supabase-js";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";

export async function signupAction(input: SignUpFormValues): Promise<ActionResult<User>> {
    const {data, success, error} = signUpSchema.safeParse(input);
  
    if (!success) {
      const appError = new ApplicationError({ code: AppErrorCode.VALIDATION_FAILED, message: error.issues[0].message });
      return fail(toActionError(appError));
    }  
  
    try {
      const { email, password } = data;
      const useCase = await makeSignupUserUseCase();
      const result = await useCase.execute(email, password);
      if (!result.success) {
        return fail(toActionError(result.error));
      }
      return ok(result.data);
    } catch (error) {
      console.error("Unexpected sign up action error:", error);
      const appError = ApplicationError.unexpected(error);
      return fail(toActionError(appError));
    }
  }