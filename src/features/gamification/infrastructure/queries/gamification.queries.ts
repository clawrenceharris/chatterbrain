import { Prisma } from "@/lib/db/prisma";

export const gamificationEncounterArgs = {
  select: {
    id: true,
    completedAt: true,
    review: {
      select: {
        skillScores: true,
        unlockedBadgeIds: true,
        items: {
          select: {
            criterion: true,
            xpEarned: true,
          },
        },
      },
    },
  },
} satisfies Prisma.EncounterDefaultArgs;

export type GamificationEncounterRecord = Prisma.EncounterGetPayload<
  typeof gamificationEncounterArgs
>;
