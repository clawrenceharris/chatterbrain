import { ProfileRepository } from "@/features/profile/domain/repositories";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";
import { CompleteOnboardingInput, CompleteOnboardingResult } from "../dto";
import { AuthProvider } from "@/features/auth/domain/services";

export class CompleteOnboardingUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly authProvider: AuthProvider,
  ) {}

  async execute(
    input: CompleteOnboardingInput,
  ): Promise<Result<CompleteOnboardingResult>> {
    const { userId, birthday, gender, goals, interests, dataConsentAccepted } =
      input;

    if (!dataConsentAccepted) {
      return fail(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Data consent is required to complete onboarding.",
        }),
      );
    }

    try {
      const now = new Date();
      await this.profileRepository.update(userId, {
        birthday: birthday?.trim() || null,
        gender: gender?.trim() || null,
        goals,
        interests,
        dataConsentAcceptedAt: now,
        onboardingCompletedAt: now,
      });
      try {
        await this.authProvider.updateUserMetadata({
          needs_onboarding: false,
        });
      } catch (error) {
        await this.profileRepository.update(userId, {
          onboardingCompletedAt: null,
        });
        return fail(normalizeError(error));
      }
      return ok({
        userId,
        onboardingCompletedAt: now,
      });
    } catch (error) {
      console.error("Error completing onboarding", error);
      return fail(normalizeError(error));
    }
  }
}