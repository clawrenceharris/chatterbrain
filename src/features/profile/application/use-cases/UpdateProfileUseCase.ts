import { ProfileRepository } from "../../domain/repositories";
import { UserAvatarStorage } from "../../domain/services";
import { UpdateProfileInput } from "../dto";
import { fail, ok, Result } from "@/shared/application";
import { UpdateProfileResult } from "../dto";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { ActionError } from "@/shared/action";
import { UpdateProfileCommand } from "../../domain/types";

export class UpdateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storage: UserAvatarStorage,
  ) {}

  async execute(
    input: UpdateProfileInput,
  ): Promise<Result<UpdateProfileResult, ApplicationError | ActionError>> {
    const { avatarFile, userId } = input;
    let uploadedAvatar: { url: string | null; path: string } | null = null;

    try {
      if (avatarFile) {
        uploadedAvatar = await this.storage.upload({
          userId,
          file: avatarFile,
        });
      }

      const command: UpdateProfileCommand = {
        ...(input.displayName !== undefined && {
          displayName: input.displayName,
        }),
        ...(input.username !== undefined && { username: input.username }),
        ...(uploadedAvatar !== undefined && {
          avatarUrl: uploadedAvatar?.url ?? null,
        }),
      };
      const profile = await this.profileRepository.update(userId, command);
      return ok(profile);
    } catch (error) {
      console.error("Error creating or updating profile", error);
      if (uploadedAvatar?.path) {
        try {
          await this.storage.remove(uploadedAvatar.path);
        } catch (error) {
          console.error("Error removing avatar", error);
        }
      }
      return fail(normalizeError(error));
    }
  }
}
