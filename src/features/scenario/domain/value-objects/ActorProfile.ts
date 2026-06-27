export type ActorProfile = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  description: string | null;
  voiceId: string;
  personalityTraits: string[];
  communicationStyle: string | null;
  avatarUrl: string | null;
};
