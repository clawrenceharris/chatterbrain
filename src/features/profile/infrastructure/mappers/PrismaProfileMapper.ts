import { UserProfile } from "../../domain/entities";
import { ProfileCardResult, ProfileDetailResult } from "../../application/dto";
import { ProfileDetailRecord } from "../queries";

export class PrismaProfileMapper {
  static toCard(profile: ProfileDetailRecord): ProfileCardResult {
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
    };
  }
  static toDomain(profile: ProfileDetailRecord): UserProfile {
    return new UserProfile({
      userId: profile.userId,
      displayName: profile.displayName,
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? null,
    });
  }
  static toDetail(profile: ProfileDetailRecord): ProfileDetailResult {
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? null,
      birthday: profile.birthday ?? null,
      gender: profile.gender ?? null,
      goals: profile.goals ?? [],
      interests: profile.interests ?? [],
      dataConsentAcceptedAt: profile.dataConsentAcceptedAt ?? null,
      onboardingCompletedAt: profile.onboardingCompletedAt ?? null,
    };
  }
}
