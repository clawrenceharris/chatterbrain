import { describe, expect, it } from "vitest";
import { SocialSkill } from "@/types";
import { CORE_SOCIAL_SKILLS } from "@/lib/constants";
import type { GamificationActivitySnapshot } from "../../entities";
import { BadgeEvaluator } from "../BadgeEvaluator";
import { LevelCalculator } from "../LevelCalculator";
import { StreakCalculator } from "../StreakCalculator";

function createSnapshot(
  overrides: Partial<GamificationActivitySnapshot> = {},
): GamificationActivitySnapshot {
  return {
    userId: "user-1",
    completedEncounterCount: 0,
    abandonedEncounterCount: 0,
    helperUseCount: 0,
    totalXp: 0,
    coreSkillXp: Object.fromEntries(
      CORE_SOCIAL_SKILLS.map((skill) => [skill, 0]),
    ) as GamificationActivitySnapshot["coreSkillXp"],
    practiceDates: [],
    unlockedBadgeIds: [],
    encounters: [],
    currentEncounterId: null,
    ...overrides,
  };
}

describe("BadgeEvaluator", () => {
  it("unlocks the first encounter badge", () => {
    const badges = BadgeEvaluator.evaluateNewBadges(
      createSnapshot({ completedEncounterCount: 1 }),
    );
    expect(badges).toContain("first-encounter");
  });

  it("does not re-unlock badges already earned", () => {
    const badges = BadgeEvaluator.evaluateNewBadges(
      createSnapshot({
        completedEncounterCount: 3,
        unlockedBadgeIds: ["first-encounter", "hat-trick"],
      }),
    );
    expect(badges).not.toContain("first-encounter");
    expect(badges).not.toContain("hat-trick");
  });

  it("unlocks skill surge when a core skill scores 80+", () => {
    const badges = BadgeEvaluator.evaluateNewBadges(
      createSnapshot({
        encounters: [
          {
            id: "encounter-1",
            completedAt: "2026-01-01T00:00:00.000Z",
            totalXp: 40,
            coreSkillXp: Object.fromEntries(
              CORE_SOCIAL_SKILLS.map((skill) => [skill, 0]),
            ) as GamificationActivitySnapshot["coreSkillXp"],
            unlockedBadgeIds: [],
            skillScores: { [SocialSkill.CLARITY]: 85 },
          },
        ],
      }),
    );
    expect(badges).toContain("skill-surge");
  });
});

describe("LevelCalculator", () => {
  it("starts at level 1 and progresses with XP", () => {
    expect(LevelCalculator.fromTotalXp(0).level).toBe(1);
    expect(LevelCalculator.fromTotalXp(75).level).toBe(2);
  });
});

describe("StreakCalculator", () => {
  it("counts consecutive practice days ending today", () => {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString();

    expect(
      StreakCalculator.fromPracticeDates([twoDaysAgo, yesterday, today]),
    ).toBe(3);
  });
});
