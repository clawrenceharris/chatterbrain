import { ProfileRepository } from "../../domain/repositories";
import { CheckUsernameResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils";
type CheckUsernameUseCaseResult = Result<CheckUsernameResult>;
export class CheckUsernameUseCase {
  constructor(private readonly userProfileRepository: ProfileRepository) {}

  async execute(
    username: string,
    userId: string,
  ): Promise<CheckUsernameUseCaseResult> {
    try {
      const result = await this.userProfileRepository.checkUsername(
        username,
        userId,
      );
      return ok(result);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
