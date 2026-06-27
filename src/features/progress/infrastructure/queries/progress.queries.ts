import { Prisma } from "@/lib/db/prisma";

export const progressEncounterArgs = {
  select: {
    id: true,
    completedAt: true,
    scenario: {
      select: {
        id: true,
        title: true,
        slug: true,
      },
    },
    actor: {
      select: {
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    },
    review: {
      select: {
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

export type ProgressEncounterRecord = Prisma.EncounterGetPayload<
  typeof progressEncounterArgs
>;
