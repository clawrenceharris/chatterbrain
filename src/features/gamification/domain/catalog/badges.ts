import type { StaticImageData } from "next/image";
import { assets } from "@/lib/constants";
import type { CoreSocialSkill } from "@/lib/constants";
import { SocialSkill } from "@/types";

export type BadgeTier = "bronze" | "silver" | "gold";

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  image: StaticImageData;
};

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: "first-encounter",
    title: "First steps",
    description: "Complete your first encounter.",
    tier: "bronze",
    image: assets.chatterbrain_smile_sticker,
  },
  {
    id: "hat-trick",
    title: "Hat trick",
    description: "Complete 3 encounters.",
    tier: "bronze",
    image: assets.thumbs_up_sticker,
  },
  {
    id: "social-regular",
    title: "Social regular",
    description: "Complete 5 encounters.",
    tier: "silver",
    image: assets.chat_bubbles_sticker,
  },
  {
    id: "empathy-star",
    title: "Empathy star",
    description: "Earn 50 empathy XP across encounters.",
    tier: "silver",
    image: assets.good_empathy_chip,
  },
  {
    id: "clear-voice",
    title: "Clear voice",
    description: "Earn 50 clarity XP across encounters.",
    tier: "silver",
    image: assets.clear_response_chip,
  },
  {
    id: "skill-surge",
    title: "Skill surge",
    description: "Score 80+ on any core skill in one encounter.",
    tier: "gold",
    image: assets.stars_sticker,
  },
  {
    id: "on-a-roll",
    title: "On a roll",
    description: "Practice 3 days in a row.",
    tier: "gold",
    image: assets.star_sticker,
  },
  {
    id: "xp-collector",
    title: "XP collector",
    description: "Earn 100 total XP.",
    tier: "gold",
    image: assets.confident_chip,
  },
  {
    id: "helper-habit",
    title: "Helper habit",
    description: "Use a Chitter helper during an encounter.",
    tier: "bronze",
    image: assets.tone_analyzer_sticker,
  },
];

export const BADGE_BY_ID = Object.fromEntries(
  BADGE_CATALOG.map((badge) => [badge.id, badge]),
) as Record<string, BadgeDefinition>;

export const CORE_SKILL_BADGE_THRESHOLDS: Partial<
  Record<CoreSocialSkill, { badgeId: string; xp: number }>
> = {
  [SocialSkill.EMPATHY]: { badgeId: "empathy-star", xp: 50 },
  [SocialSkill.CLARITY]: { badgeId: "clear-voice", xp: 50 },
};
