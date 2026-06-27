export type ProfileDetailResult = {
  userId: string;
  displayName: string | null;
  username: string;
  avatarUrl: string | null;
  birthday: string | null;
  gender: string | null;
  goals: string[];
  interests: string[];
  dataConsentAcceptedAt: Date | null;
  onboardingCompletedAt: Date | null;
};
