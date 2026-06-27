import type { SocialSkill } from "@/types";
import type { ProgressEncounter } from "../../domain/entities";
import type { ProgressEncounterRecord } from "../queries";

export class PrismaProgressMapper {
  static toDomain(record: ProgressEncounterRecord): ProgressEncounter {
    return {
      id: record.id,
      completedAt: record.completedAt?.toISOString() ?? null,
      scenario: {
        id: record.scenario.id,
        title: record.scenario.title,
        slug: record.scenario.slug,
      },
      actor: {
        displayName: `${record.actor.firstName} ${record.actor.lastName}`,
        avatarUrl: record.actor.avatarUrl,
      },
      reviewItems:
        record.review?.items.map((item) => ({
          criterion: item.criterion as SocialSkill,
          xpEarned: item.xpEarned,
        })) ?? [],
    };
  }
}
