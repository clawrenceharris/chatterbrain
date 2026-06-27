import { EncounterStatus } from "@/features/encounter/domain/value-objects";
import { ScoreSummary } from "@/features/encounter/domain/value-objects";
import { ScenarioLike, ScenarioSave } from "../../domain/value-objects";
import { ScenarioPreviewMessage } from "./ScenarioForPreivew";
import { ScenarioDetailDomain } from "./ScenarioDetailResult";
import { Difficulty } from "@/types";

export type ScenarioDetailTagVariant =
  | "domain"
  | "category"
  | "difficulty"
  | "successCriteria"
  | "contentWarning";

export type ScenarioDetailTag = {
  label: string;
  variant: ScenarioDetailTagVariant;
};

export type ScenarioDetailHelper = {
  id: string;
  label: string;
  description: string;
  href: string;
  iconSrc: string;
};
export type ScenarioDetailActor = {
  id: string;
  name: string;
  description: string;
  role: string;
  avatarUrl: string | null;
  openingMessage?: string | null;
};
export type ScenarioDetailEncounterActor = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};
export type ScenarioDetailEncounter = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  status: {
    label: string;
    value: EncounterStatus;
  };
  actor: ScenarioDetailEncounterActor | null;
  variableValues: Record<string, string> | null;
  completed: boolean;
  completedAt: string | null;
  reviewSkillScores: ScoreSummary | null;
};
export type ScenarioEncounterHistorySummary = {
  lastPlayedLabel: string;
  completedCountLabel: string;
  strongestSkillLabel: string;
  nextSuggestedFocusLabel: string;
};
export type ScenarioDetailPageOutput = {
  sampleConversation: ScenarioPreviewMessage[];
  primaryDomain: ScenarioDetailDomain;
  secondaryDomain: ScenarioDetailDomain | null;
  difficulty: {
    label: string;
    description: string;
    className: string;
    icon: React.ReactNode;
    value: Difficulty;
  };
  playButtonLabel: string;
  contentWarnings: string[];
  id: string;
  slug: string;
  totalUserPlayCount: number;
  likes: ScenarioLike[];
  saves: ScenarioSave[];
  encounters: ScenarioDetailEncounter[];
  title: string;
  defaultActorId: string | null;
  imageUrl: string | null;
  hasEncounter: boolean;
  mostRecentEncounter: ScenarioDetailEncounter | null;
  resumeEncounter: ScenarioDetailEncounter | null;
  lastReviewEncounter: ScenarioDetailEncounter | null;
  historySummary: ScenarioEncounterHistorySummary;
  description: string;
  setting: string;
  goal: string;
  focusSkills: string[];
  actor: ScenarioDetailActor | null;
  successCriteria: string[];
};
