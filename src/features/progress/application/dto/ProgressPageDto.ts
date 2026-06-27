import type { CoreSocialSkill } from "@/lib/constants";

export type ProgressEncounterXp = {
  id: string;
  scenarioTitle: string;
  scenarioSlug: string;
  actorDisplayName: string;
  actorAvatarUrl: string | null;
  completedAt: string | null;
  totalXp: number;
};

export type ProgressSkillXp = {
  skill: CoreSocialSkill;
  label: string;
  xp: number;
};

export type ProgressPageHighlights = {
  strongestSkill: ProgressSkillXp | null;
  bestEncounter: ProgressEncounterXp | null;
};

export type ProgressPageOutput = {
  totalXp: number;
  encounters: ProgressEncounterXp[];
  coreSkillXp: ProgressSkillXp[];
  highlights: ProgressPageHighlights;
};

export type ProgressPageAssemblerInput = {
  totalXp: number;
  encounters: ProgressEncounterXp[];
  coreSkillXp: ProgressSkillXp[];
  strongestSkill: ProgressSkillXp | null;
  bestEncounter: ProgressEncounterXp | null;
};
