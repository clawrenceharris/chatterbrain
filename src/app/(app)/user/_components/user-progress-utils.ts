import type { ProgressSkillXp } from "@/features/progress/application/dto";
import type { CoreSocialSkill } from "@/lib/constants";
import { SOCIAL_SKILL_LABELS } from "@/lib/constants";
import { SocialSkill } from "@/types";

const LEVEL_TITLES = [
  "Conversation Starter",
  "Social Explorer",
  "Active Listener",
  "Clear Communicator",
  "Social Navigator",
  "Connection Builder",
] as const;

export function getLevelTitle(level: number): string {
  const index = Math.min(level - 1, LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[Math.max(0, index)];
}

export function findWeakestSkill(
  skills: ProgressSkillXp[],
): ProgressSkillXp | null {
  const practiced = skills.filter((skill) => skill.xp > 0);
  const pool = practiced.length > 0 ? practiced : skills;
  const weakest = [...pool].sort((left, right) => left.xp - right.xp)[0];
  return weakest ?? null;
}

const SKILL_SUMMARIES: Record<
  CoreSocialSkill,
  { strong: string; growth: string }
> = {
  [SocialSkill.EMPATHY]: {
    strong: "You show understanding and care.",
    growth: "Keep practicing to reflect feelings back clearly.",
  },
  [SocialSkill.ASSERTIVENESS]: {
    strong: "You share your needs with confidence.",
    growth: "Keep practicing to share your needs clearly.",
  },
  [SocialSkill.CLARITY]: {
    strong: "You communicate ideas in a direct way.",
    growth: "Keep practicing to make your message easier to follow.",
  },
  [SocialSkill.ENGAGEMENT]: {
    strong: "You keep conversations lively and present.",
    growth: "Keep practicing to stay curious and involved.",
  },
  [SocialSkill.SOCIAL_AWARENESS]: {
    strong: "You read the room and adjust well.",
    growth: "Keep practicing to notice social cues sooner.",
  },
  [SocialSkill.SETTING_BOUNDARIES]: {
    strong: "You protect your limits with respect.",
    growth: "Keep practicing to state boundaries calmly.",
  },
};

export function getSkillSummary(
  skill: CoreSocialSkill,
  type: "strong" | "growth",
): string {
  return SKILL_SUMMARIES[skill][type];
}

export function countRoundsThisWeek(
  completedDates: Array<string | null | undefined>,
): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(now.getDate() + mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  return completedDates.filter((date) => {
    if (!date) return false;
    const completed = new Date(date);
    return completed >= startOfWeek;
  }).length;
}

export type WeekDayStatus = {
  label: string;
  completed: boolean;
  isToday: boolean;
};

export function getWeekPracticeStatus(
  practiceDateKeys: string[],
): WeekDayStatus[] {
  const practiced = new Set(practiceDateKeys.map((date) => date.slice(0, 10)));
  const today = new Date();
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"] as const;
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return dayLabels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const isToday = key === today.toISOString().slice(0, 10);

    return {
      label,
      completed: practiced.has(key),
      isToday,
    };
  });
}

export function getSkillLabel(skill: CoreSocialSkill): string {
  return SOCIAL_SKILL_LABELS[skill];
}
