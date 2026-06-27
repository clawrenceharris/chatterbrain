import type { StaticImageData } from "next/image";

export type BadgeTier = "bronze" | "silver" | "gold";

export type UnlockedBadge = {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  image: StaticImageData;
  unlockedAt: string | null;
};

export type BadgeGalleryItem = UnlockedBadge & {
  isUnlocked: boolean;
};

export type GamificationLevel = {
  level: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  progressPercent: number;
};

export type GamificationSummaryOutput = {
  totalXp: number;
  level: GamificationLevel;
  streakDays: number;
  unlockedCount: number;
  totalBadges: number;
  badges: BadgeGalleryItem[];
  newlyUnlockedBadgeIds: string[];
};

export type RecordPracticeActivityResult = {
  newlyUnlockedBadges: UnlockedBadge[];
};
