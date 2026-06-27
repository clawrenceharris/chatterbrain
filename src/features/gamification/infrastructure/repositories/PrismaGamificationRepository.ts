import type { PrismaClient } from "@/lib/db/prisma";
import type { GamificationRepository } from "../../domain/repositories";
import { PrismaGamificationMapper } from "../mappers";
import { gamificationEncounterArgs } from "../queries";

export class PrismaGamificationRepository implements GamificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findActivitySnapshot(userId: string, currentEncounterId?: string) {
    const [encounters, abandonedEncounterCount, helperUseCount] =
      await Promise.all([
        this.prisma.encounter.findMany({
          where: {
            userId,
            status: "COMPLETED",
            review: { isNot: null },
          },
          orderBy: { completedAt: "asc" },
          ...gamificationEncounterArgs,
        }),
        this.prisma.encounter.count({
          where: { userId, status: "ABANDONED" },
        }),
        this.prisma.helperUse.count({
          where: { encounter: { userId } },
        }),
      ]);

    return PrismaGamificationMapper.toActivitySnapshot({
      userId,
      encounters,
      abandonedEncounterCount,
      helperUseCount,
      currentEncounterId,
    });
  }

  async updateEncounterUnlockedBadges(encounterId: string, badgeIds: string[]) {
    const review = await this.prisma.encounterReview.findUnique({
      where: { encounterId },
      select: { unlockedBadgeIds: true },
    });

    if (!review) return;

    await this.prisma.encounterReview.update({
      where: { encounterId },
      data: {
        unlockedBadgeIds: [
          ...new Set([...review.unlockedBadgeIds, ...badgeIds]),
        ],
      },
    });
  }
}
