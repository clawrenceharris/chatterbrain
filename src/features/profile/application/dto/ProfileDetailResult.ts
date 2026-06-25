export type ProfileDetailResult = {
  userId: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  birthday: string | null;
  gender: string | null;
  goals: string[];
  interests: string[];
  dataConsentAcceptedAt: Date | null;
  onboardingCompletedAt: Date | null;
};
