import { SocialSkill } from "@/types";
import { ScenarioVariable } from "../../domain/value-objects";
import { Difficulty } from "@/types";

export interface CreateScenarioInput {
  slug: string;
  title: string;
  description: string;
  variables: ScenarioVariable[];
  difficulty: Difficulty;
  domainIds: string[];
  tags: string[];
  actorRole: string;
  actorRelationshipType: string;
  focusSkills: SocialSkill[];
  setting: string;
  userRole: string;
  userGoal: string;
  openingMessage: string;
  successCriteria: string[];
  contentWarnings: string[];
  xpReward: number;
  supportNote: string;
}
