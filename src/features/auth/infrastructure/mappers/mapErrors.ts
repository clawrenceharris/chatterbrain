import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/error.types";
import { AuthError } from "@supabase/supabase-js";

export function mapSupabaseAuthError(error: unknown): ApplicationError {
  if (error instanceof AuthError) {
    switch (error.code) {
      case "email_exists":
        return new ApplicationError({
          code: AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
          message: "An account with this email already exists.",
          cause: error,
        });

      case "invalid_credentials":
        console.log("invalid_credentials", error);
        return new ApplicationError({
          code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
          message: "The email or password is incorrect.",
          cause: error,
        });

      case "weak_password":
        return new ApplicationError({
          code: AppErrorCode.AUTH_PASSWORD_TOO_WEAK,
          message: "Please choose a stronger password.",
          cause: error,
        });

      default:
        return new ApplicationError({
          code: AppErrorCode.AUTH_PROVIDER_ERROR,
          message: "Authentication failed.",
          cause: error,
        });
    }
  }
  console.log("unknown error", error);
  return ApplicationError.unexpected(error);
}
