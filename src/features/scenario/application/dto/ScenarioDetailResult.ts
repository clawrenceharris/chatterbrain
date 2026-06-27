import { Difficulty, SocialSkill } from "@/types";
import { ScenarioVariable } from "../../domain/value-objects";
import { ScenarioDetailEncounter } from "./ScenarioDetailPageOutput";
import { ScenarioPreviewMessage } from "./ScenarioForPreivew";

export type ScenarioDetailDomain = {
  slug: string;
  title: string;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
};
export type ScenarioDetailResult = {
  id: string;
  scenarioLikeCount: number;
  primaryDomain: ScenarioDetailDomain;
  secondaryDomain: ScenarioDetailDomain | null;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  defaultActorId: string | null;
  focusSkills: SocialSkill[];
  completed: boolean;
  imageUrl: string | null;
  totalUserLikeCount: number;
  totalUserSaveCount: number;
  actorRole: string;
  actorRelationshipType: string;
  hasActiveEncounter: boolean;

  shortDescription: string | null;

  variables: ScenarioVariable[];

  setting: string;
  userRole: string | null;
  userGoal: string;
  openingMessage: string | null;
  successCriteria: string[];
  contentWarnings: string[];
  supportNote: string | null;
  xpReward: number;
  encounters: ScenarioDetailEncounter[];
  sampleConversation: ScenarioPreviewMessage[];
};
