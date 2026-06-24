import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export type GetCurrentUserUseCaseResult = Result<User | null, ApplicationError>;
export class GetCurrentUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(): Promise<GetCurrentUserUseCaseResult> {
        const user = await this.authProvider.getUser();
        return ok(user);
    }
}
