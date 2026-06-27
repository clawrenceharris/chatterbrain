import {
  CORE_SOCIAL_SKILLS,
  SOCIAL_SKILL_LABELS,
  type CoreSocialSkill,
} from "@/lib/constants";
import type { SocialSkill } from "@/types";
import type { ProgressEncounter, ProgressReviewItem } from "../entities";
import type {
  ProgressEncounterXp,
  ProgressSkillXp,
} from "../../application/dto";

function isCoreSkill(skill: SocialSkill): skill is CoreSocialSkill {
  return (CORE_SOCIAL_SKILLS as readonly SocialSkill[]).includes(skill);
}

export class ProgressAggregator {
  static sumReviewItemsXp(items: ProgressReviewItem[]): number {
    return items.reduce((total, item) => total + item.xpEarned, 0);
  }

  static sumXpByCoreSkill(
    items: ProgressReviewItem[],
  ): Record<CoreSocialSkill, number> {
    const totals = Object.fromEntries(
      CORE_SOCIAL_SKILLS.map((skill) => [skill, 0]),
    ) as Record<CoreSocialSkill, number>;

    for (const item of items) {
      if (!isCoreSkill(item.criterion)) continue;
      totals[item.criterion] += item.xpEarned;
    }

    return totals;
  }

  static toEncounterXp(encounter: ProgressEncounter): ProgressEncounterXp {
    return {
      id: encounter.id,
      scenarioTitle: encounter.scenario.title,
      scenarioSlug: encounter.scenario.slug,
      actorDisplayName: encounter.actor.displayName,
      actorAvatarUrl: encounter.actor.avatarUrl,
      completedAt: encounter.completedAt,
      totalXp: ProgressAggregator.sumReviewItemsXp(encounter.reviewItems),
    };
  }

  static toCoreSkillXp(
    skillTotals: Record<CoreSocialSkill, number>,
  ): ProgressSkillXp[] {
    return CORE_SOCIAL_SKILLS.map((skill) => ({
      skill,
      label: SOCIAL_SKILL_LABELS[skill],
      xp: skillTotals[skill],
    }));
  }

  static findStrongestSkill(
    skillXp: ProgressSkillXp[],
  ): ProgressSkillXp | null {
    const ranked = [...skillXp].sort((left, right) => right.xp - left.xp);
    const strongest = ranked[0];
    return strongest && strongest.xp > 0 ? strongest : null;
  }

  static findBestEncounter(
    encounters: ProgressEncounterXp[],
  ): ProgressEncounterXp | null {
    const ranked = [...encounters].sort(
      (left, right) => right.totalXp - left.totalXp,
    );
    const best = ranked[0];
    return best && best.totalXp > 0 ? best : null;
  }

  static aggregate(encounters: ProgressEncounter[]) {
    const encounterXp = encounters.map((encounter) =>
      ProgressAggregator.toEncounterXp(encounter),
    );

    const combinedItems = encounters.flatMap(
      (encounter) => encounter.reviewItems,
    );
    const coreSkillTotals = ProgressAggregator.sumXpByCoreSkill(combinedItems);
    const coreSkillXp = ProgressAggregator.toCoreSkillXp(coreSkillTotals);

    return {
      totalXp: ProgressAggregator.sumReviewItemsXp(combinedItems),
      encounters: encounterXp,
      coreSkillXp,
      strongestSkill: ProgressAggregator.findStrongestSkill(coreSkillXp),
      bestEncounter: ProgressAggregator.findBestEncounter(encounterXp),
    };
  }
}
