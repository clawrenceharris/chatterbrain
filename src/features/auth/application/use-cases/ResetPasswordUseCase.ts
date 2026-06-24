import { ApplicationError } from "@/shared/utils/errors";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { ok, Result } from "@/shared/application";

export type ResetPasswordUseCaseResult = Result<void, ApplicationError>;
export class ResetPasswordUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(newPassword: string, token: string): Promise<ResetPasswordUseCaseResult> {
      await this.authProvider.resetPassword(newPassword, token);
      return ok(undefined);
    
    
  }
}
