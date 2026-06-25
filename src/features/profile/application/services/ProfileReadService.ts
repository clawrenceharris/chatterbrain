import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { Result, fail, ok } from "@/shared/application";
import { ProfileReadRepository } from "@/features/profile/domain/repositories";
import { ProfileCardResult, ProfileDetailResult } from "../dto";

export class ProfileReadService {
  constructor(private readonly profileReadRepository: ProfileReadRepository) {}

  async getProfileCard(
    userId: string,
  ): Promise<Result<ProfileCardResult | null>> {
    try {
      const profile = await this.profileReadRepository.findProfileCard(userId);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getProfileDetail(
    userId: string,
  ): Promise<Result<ProfileDetailResult | null, ApplicationError>> {
    try {
      const profile =
        await this.profileReadRepository.findProfileDetail(userId);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
