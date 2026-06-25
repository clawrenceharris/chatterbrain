export type CompleteOnboardingInput = {
  userId: string;
  birthday?: string | null;
  gender?: string | null;
  goals: string[];
  interests: string[];
  dataConsentAccepted: boolean;
};

export type CompleteOnboardingResult = {
  userId: string;
  onboardingCompletedAt: Date;
};
