import { Difficulty } from "@/types";

export type CreateScenarioResult = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
};
