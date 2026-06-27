export type ActorDetailResult = {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  avatarUrl: string | null;
  voiceId: string;
  personalityTraits: string[];
  communicationStyle: string | null;
};
