import { SocialSkill, Difficulty } from "@/types";
import { ScenarioVariable } from "../../domain/value-objects";

export interface UpdateScenarioInput {
  scenarioId: string;
  title?: string;
  shortDescription?: string | null;
  description?: string;
  difficulty?: Difficulty;
  domainIds?: string[];
  actorId?: string | null;
  tags?: string[];
  focusSkills?: SocialSkill[];
  setting?: string;
  userRole?: string | null;
  userGoal?: string;
  openingPrompt?: string;
  successCriteria?: string[];
  variables?: ScenarioVariable[];
  contentWarnings?: string[];
  xpReward?: number;
  supportNote?: string | null;
}
