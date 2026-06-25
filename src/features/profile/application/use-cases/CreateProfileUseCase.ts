import { normalizeError } from "@/shared/utils";
import { ProfileRepository } from "../../domain/repositories";
import { AvatarStorage } from "../../domain/services";
import { CreateProfileInput, CreateProfileResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";

export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storage: AvatarStorage,
  ) {}

  async execute(
    input: CreateProfileInput,
  ): Promise<Result<CreateProfileResult>> {
    const { userId, firstName, lastName, avatarFile } = input;
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
        firstName,
        userId,
        lastName,
        avatarUrl: uploadedAvatar?.url ?? null,
      });

      return ok({
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
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
