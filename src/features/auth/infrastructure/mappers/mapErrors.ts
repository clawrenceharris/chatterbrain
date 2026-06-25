import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/error.types";
import { AuthError } from "@supabase/supabase-js";

export function mapSupabaseAuthError(error: unknown): ApplicationError {
  if (error instanceof AuthError) {
    console.log("error code:", error.code);

    switch (error.code) {
      case "email_exists":
      case "user_already_exists":
        return new ApplicationError({
          code: AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
          cause: error,
        });
      case "invalid_credentials":
        console.log("invalid_credentials", error);
        return new ApplicationError({
          code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
          cause: error,
        });
      case "same_password":
        return new ApplicationError({
          code: AppErrorCode.AUTH_PASSWORD_ALREADY_USED,
          cause: error,
        });
      case "weak_password":
        return new ApplicationError({
          code: AppErrorCode.AUTH_PASSWORD_TOO_WEAK,
          cause: error,
        });

      default:
        return new ApplicationError({
          code: AppErrorCode.AUTH_PROVIDER_ERROR,
          cause: error,
        });
    }
  }
  console.log("unknown error", error);
  return ApplicationError.unexpected(error);
}
