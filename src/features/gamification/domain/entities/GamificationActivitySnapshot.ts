import type { CoreSocialSkill } from "@/lib/constants";
import type { SocialSkill } from "@/types";

export type GamificationEncounterSnapshot = {
  id: string;
  completedAt: string | null;
  totalXp: number;
  skillScores: Partial<Record<SocialSkill, number>>;
  coreSkillXp: Record<CoreSocialSkill, number>;
  unlockedBadgeIds: string[];
};

export type GamificationActivitySnapshot = {
  userId: string;
  completedEncounterCount: number;
  abandonedEncounterCount: number;
  helperUseCount: number;
  totalXp: number;
  coreSkillXp: Record<CoreSocialSkill, number>;
  practiceDates: string[];
  unlockedBadgeIds: string[];
  encounters: GamificationEncounterSnapshot[];
  currentEncounterId: string | null;
};
