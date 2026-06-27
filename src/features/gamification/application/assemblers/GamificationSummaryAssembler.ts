import { BADGE_BY_ID, BADGE_CATALOG } from "../../domain/catalog";
import type { GamificationActivitySnapshot } from "../../domain/entities";
import { LevelCalculator, StreakCalculator } from "../../domain/services";
import type {
  BadgeGalleryItem,
  GamificationSummaryOutput,
  UnlockedBadge,
} from "../dto";

function buildBadgeUnlockDates(
  snapshot: GamificationActivitySnapshot,
): Map<string, string> {
  const unlockDates = new Map<string, string>();

  for (const encounter of snapshot.encounters) {
    if (!encounter.completedAt) continue;
    for (const badgeId of encounter.unlockedBadgeIds) {
      if (!unlockDates.has(badgeId)) {
        unlockDates.set(badgeId, encounter.completedAt);
      }
    }
  }

  return unlockDates;
}

export class GamificationSummaryAssembler {
  static toSummaryOutput(
    snapshot: GamificationActivitySnapshot,
    newlyUnlockedBadgeIds: string[] = [],
  ): GamificationSummaryOutput {
    const unlockedIds = new Set(snapshot.unlockedBadgeIds);
    const unlockDates = buildBadgeUnlockDates(snapshot);
    const badges: BadgeGalleryItem[] = BADGE_CATALOG.map((badge) => ({
      id: badge.id,
      title: badge.title,
      description: badge.description,
      tier: badge.tier,
      image: badge.image,
      unlockedAt: unlockDates.get(badge.id) ?? null,
      isUnlocked: unlockedIds.has(badge.id),
    }));

    return {
      totalXp: snapshot.totalXp,
      level: LevelCalculator.fromTotalXp(snapshot.totalXp),
      streakDays: StreakCalculator.fromPracticeDates(snapshot.practiceDates),
      unlockedCount: unlockedIds.size,
      totalBadges: BADGE_CATALOG.length,
      badges,
      newlyUnlockedBadgeIds,
    };
  }

  static toUnlockedBadges(badgeIds: string[]): UnlockedBadge[] {
    return badgeIds.flatMap((badgeId) => {
      const badge = BADGE_BY_ID[badgeId];
      if (!badge) return [];
      return [
        {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          tier: badge.tier,
          image: badge.image,
          unlockedAt: new Date().toISOString(),
        },
      ];
    });
  }
}
