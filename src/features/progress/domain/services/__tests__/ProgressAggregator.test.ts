import { describe, expect, it } from "vitest";
import { SocialSkill } from "@/types";
import type { ProgressEncounter } from "../../entities";
import { ProgressAggregator } from "../ProgressAggregator";

describe("ProgressAggregator", () => {
  const encounters: ProgressEncounter[] = [
    {
      id: "encounter-1",
      completedAt: "2026-01-01T00:00:00.000Z",
      scenario: {
        id: "scenario-1",
        title: "Roommate noise",
        slug: "roommate-noise",
      },
      actor: {
        displayName: "Jordan",
        avatarUrl: null,
      },
      reviewItems: [
        { criterion: SocialSkill.EMPATHY, xpEarned: 20 },
        { criterion: SocialSkill.CLARITY, xpEarned: 10 },
        { criterion: SocialSkill.REPAIR, xpEarned: 5 },
      ],
    },
    {
      id: "encounter-2",
      completedAt: "2026-01-02T00:00:00.000Z",
      scenario: {
        id: "scenario-2",
        title: "Coworker chat",
        slug: "coworker-chat",
      },
      actor: {
        displayName: "Sam",
        avatarUrl: null,
      },
      reviewItems: [
        { criterion: SocialSkill.EMPATHY, xpEarned: 15 },
        { criterion: SocialSkill.ASSERTIVENESS, xpEarned: 25 },
      ],
    },
  ];

  it("aggregates total XP and per-encounter XP", () => {
    const result = ProgressAggregator.aggregate(encounters);

    expect(result.totalXp).toBe(75);
    expect(result.encounters).toHaveLength(2);
    expect(result.encounters[0]?.totalXp).toBe(35);
    expect(result.encounters[1]?.totalXp).toBe(40);
  });

  it("only counts core skills in skill totals", () => {
    const result = ProgressAggregator.aggregate(encounters);
    const empathy = result.coreSkillXp.find(
      (skill) => skill.skill === SocialSkill.EMPATHY,
    );

    expect(empathy?.xp).toBe(35);
    expect(result.coreSkillXp).toHaveLength(6);
  });

  it("identifies strongest skill and best encounter", () => {
    const result = ProgressAggregator.aggregate(encounters);

    expect(result.strongestSkill?.skill).toBe(SocialSkill.EMPATHY);
    expect(result.strongestSkill?.xp).toBe(35);
    expect(result.bestEncounter?.id).toBe("encounter-2");
    expect(result.bestEncounter?.totalXp).toBe(40);
  });
});
