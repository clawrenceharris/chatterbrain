import { AuthProvider } from "../../domain/services/AuthProvider";
import { ApplicationError } from "@/shared/utils/errors";
import { ok, Result } from "@/shared/application";

export type RequestPasswordResetUseCaseResult = Result<void, ApplicationError>;
export class RequestPasswordResetUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(email: string): Promise<RequestPasswordResetUseCaseResult> {
    await this.authProvider.requestPasswordReset(email);
    return ok(undefined);
  }
}
