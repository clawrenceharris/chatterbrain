import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { fail, ok, Result } from "@/shared/application";

export type ResetPasswordUseCaseResult = Result<void, ApplicationError>;
export class ResetPasswordUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(newPassword: string): Promise<ResetPasswordUseCaseResult> {
    try {
      await this.authProvider.resetPassword(newPassword);
      return ok(undefined);
    } catch (error) {
      console.error("Error resetting password", error);
      return fail(normalizeError(error));
    }
  }
}
