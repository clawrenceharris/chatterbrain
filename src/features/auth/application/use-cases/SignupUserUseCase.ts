import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { fail, ok, Result } from "@/shared/application";
import { AppErrorCode } from "@/types";

export type SignUpUseCaseResult = Result<User, ApplicationError>;
export class SignupUserUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(email: string, password: string): Promise<SignUpUseCaseResult> {
    try {
      const user = await this.authProvider.signUp(email, password);
      if (!user) {
        return fail(
          new ApplicationError({ code: AppErrorCode.AUTH_USER_NOT_FOUND }),
        );
      }
      return ok(user);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
