import { ApplicationError } from "@/shared/utils/errors";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { ok, Result } from "@/shared/application";


export type SignOutUseCaseResult = Result<void, ApplicationError>;  
export class SignOutUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(): Promise<SignOutUseCaseResult> {
        await this.authProvider.signOut();
        return ok(undefined);
    }
}