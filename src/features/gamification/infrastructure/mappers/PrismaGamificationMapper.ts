import { CORE_SOCIAL_SKILLS, type CoreSocialSkill } from "@/lib/constants";
import type { SocialSkill } from "@/types";
import type {
  GamificationActivitySnapshot,
  GamificationEncounterSnapshot,
} from "../../domain/entities";
import type { GamificationEncounterRecord } from "../queries";

function isCoreSkill(skill: SocialSkill): skill is CoreSocialSkill {
  return (CORE_SOCIAL_SKILLS as readonly SocialSkill[]).includes(skill);
}

export class PrismaGamificationMapper {
  static toEncounterSnapshot(
    record: GamificationEncounterRecord,
  ): GamificationEncounterSnapshot {
    const reviewItems = record.review?.items ?? [];
    const coreSkillXp = Object.fromEntries(
      CORE_SOCIAL_SKILLS.map((skill) => [skill, 0]),
    ) as Record<CoreSocialSkill, number>;

    for (const item of reviewItems) {
      const criterion = item.criterion as SocialSkill;
      if (!isCoreSkill(criterion)) continue;
      coreSkillXp[criterion] += item.xpEarned;
    }

    const totalXp = reviewItems.reduce(
      (total, item) => total + item.xpEarned,
      0,
    );

    return {
      id: record.id,
      completedAt: record.completedAt?.toISOString() ?? null,
      totalXp,
      skillScores:
        (record.review?.skillScores as Partial<Record<SocialSkill, number>>) ??
        {},
      coreSkillXp,
      unlockedBadgeIds: record.review?.unlockedBadgeIds ?? [],
    };
  }

  static toActivitySnapshot(input: {
    userId: string;
    encounters: GamificationEncounterRecord[];
    abandonedEncounterCount: number;
    helperUseCount: number;
    currentEncounterId?: string;
  }): GamificationActivitySnapshot {
    const encounterSnapshots = input.encounters.map(
      PrismaGamificationMapper.toEncounterSnapshot,
    );

    const coreSkillXp = Object.fromEntries(
      CORE_SOCIAL_SKILLS.map((skill) => [skill, 0]),
    ) as Record<CoreSocialSkill, number>;

    for (const encounter of encounterSnapshots) {
      for (const skill of CORE_SOCIAL_SKILLS) {
        coreSkillXp[skill] += encounter.coreSkillXp[skill];
      }
    }

    const totalXp = encounterSnapshots.reduce(
      (total, encounter) => total + encounter.totalXp,
      0,
    );

    const unlockedBadgeIds = [
      ...new Set(
        input.encounters.flatMap(
          (encounter) => encounter.review?.unlockedBadgeIds ?? [],
        ),
      ),
    ];

    return {
      userId: input.userId,
      completedEncounterCount: encounterSnapshots.length,
      abandonedEncounterCount: input.abandonedEncounterCount,
      helperUseCount: input.helperUseCount,
      totalXp,
      coreSkillXp,
      practiceDates: encounterSnapshots
        .map((encounter) => encounter.completedAt)
        .filter((date): date is string => Boolean(date)),
      unlockedBadgeIds,
      encounters: encounterSnapshots,
      currentEncounterId: input.currentEncounterId ?? null,
    };
  }
}
