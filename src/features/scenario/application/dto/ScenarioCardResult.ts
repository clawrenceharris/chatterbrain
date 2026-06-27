export type ScenarioCardResult = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  focusSkills: string[];
  imageUrl: string | null;
  hasActiveEncounter: boolean;
  actor: {
    role: string;
    id: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
};
