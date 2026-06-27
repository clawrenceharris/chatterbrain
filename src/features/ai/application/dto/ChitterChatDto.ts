import type { ScenarioCardResult } from "@/features/scenario/application/dto";

export type ChitterChatRole = "user" | "assistant";

export type ChitterChatMessage = {
  id?: string;
  role: ChitterChatRole;
  content: string;
};

export type ChitterRecommendedScenario = {
  scenario: ScenarioCardResult;
  reason: string;
};

export type AskChitterInput = {
  question: string;
  history?: ChitterChatMessage[];
  currentPath?: string;
  userId: string;
  userFirstName?: string | null;
};

export type AskChitterActionInput = Omit<AskChitterInput, "userId">;

export type AskChitterOutput = {
  answer: string;
  recommendedScenarios: ChitterRecommendedScenario[];
  provider: string;
  model: string;
};
