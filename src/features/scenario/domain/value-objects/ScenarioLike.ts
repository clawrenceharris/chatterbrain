export type ScenarioLike = {
  user: {
    userId: string;
    avatarUrl: string | null;
  };
  scenarioId: string;
  createdAt: string;
};
