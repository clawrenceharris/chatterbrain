import { normalizeError } from "@/shared/utils";
import { ProfileRepository } from "../../domain/repositories";
import { UserAvatarStorage } from "../../domain/services";
import { CreateProfileInput, CreateProfileResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";

export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storage: UserAvatarStorage,
  ) {}

  async execute(
    input: CreateProfileInput,
  ): Promise<Result<CreateProfileResult>> {
    const { userId, displayName, username, avatarFile } = input;
    let uploadedAvatar: { path: string; url: string | null } | null = null;

    try {
      // upload avatar
      if (avatarFile) {
        uploadedAvatar = await this.storage.upload({
          userId,
          file: avatarFile,
        });
      }

      // create profile
      const profile = await this.profileRepository.create({
        displayName,
        username,
        userId,
        avatarUrl: uploadedAvatar?.url ?? null,
      });

      return ok({
        userId: profile.userId,
        displayName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
      });
    } catch (error) {
      if (uploadedAvatar?.path) {
        try {
          await this.storage.remove(uploadedAvatar.path);
        } catch (error) {
          console.error("Error removing avatar", error);
        }
      }
      console.error("Error creating or updating profile", error);
      return fail(normalizeError(error));
    }
  }
}
