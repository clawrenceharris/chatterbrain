import { CORE_SOCIAL_SKILLS } from "@/lib/constants";
import { SocialSkill } from "@/types";
import { BADGE_CATALOG } from "../catalog";
import type { GamificationActivitySnapshot } from "../entities";
import { StreakCalculator } from "./StreakCalculator";

export class BadgeEvaluator {
  static evaluateNewBadges(snapshot: GamificationActivitySnapshot): string[] {
    const alreadyUnlocked = new Set(snapshot.unlockedBadgeIds);

    return BADGE_CATALOG.filter((badge) => {
      if (alreadyUnlocked.has(badge.id)) return false;

      switch (badge.id) {
        case "first-encounter":
          return snapshot.completedEncounterCount >= 1;
        case "hat-trick":
          return snapshot.completedEncounterCount >= 3;
        case "social-regular":
          return snapshot.completedEncounterCount >= 5;
        case "empathy-star":
          return snapshot.coreSkillXp[SocialSkill.EMPATHY] >= 50;
        case "clear-voice":
          return snapshot.coreSkillXp[SocialSkill.CLARITY] >= 50;
        case "skill-surge":
          return snapshot.encounters.some((encounter) =>
            CORE_SOCIAL_SKILLS.some(
              (skill) => (encounter.skillScores[skill] ?? 0) >= 80,
            ),
          );
        case "on-a-roll":
          return (
            StreakCalculator.fromPracticeDates(snapshot.practiceDates) >= 3
          );
        case "xp-collector":
          return snapshot.totalXp >= 100;
        case "helper-habit":
          return snapshot.helperUseCount >= 1;
        default:
          return false;
      }
    }).map((badge) => badge.id);
  }
}
