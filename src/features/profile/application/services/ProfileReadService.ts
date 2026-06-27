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
      const profile =
        await this.profileReadRepository.findProfileCardById(userId);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
  async getProfileDetailByUsername(
    username: string,
  ): Promise<Result<ProfileDetailResult | null>> {
    try {
      const profile =
        await this.profileReadRepository.findProfileDetailByUsername(username);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
  async getProfileDetailById(
    userId: string,
  ): Promise<Result<ProfileDetailResult | null, ApplicationError>> {
    try {
      const profile =
        await this.profileReadRepository.findProfileDetailById(userId);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
