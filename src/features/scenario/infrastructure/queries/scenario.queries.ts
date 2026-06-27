import { Prisma } from "@/lib/db/prisma";

export const scenarioCardArgs = {
  select: {
    id: true,
    title: true,
    description: true,
    shortDescription: true,
    imageUrl: true,
    slug: true,
    difficulty: true,
    actorRelationshipType: true,
    focusSkills: true,
    actorRole: true,
    defaultActor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    },

    encounters: {
      select: {
        id: true,
        status: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    },
  },
} satisfies Prisma.ScenarioDefaultArgs;
export const scenarioLikeArgs = {
  select: {
    user: {
      select: {
        userId: true,
        avatarUrl: true,
      },
    },
    scenarioId: true,
    createdAt: true,
  },
} satisfies Prisma.ScenarioLikeDefaultArgs;

export const scenarioSaveArgs = {
  select: {
    scenarioId: true,
    createdAt: true,
    user: {
      select: {
        userId: true,
        avatarUrl: true,
      },
    },
  },
} satisfies Prisma.ScenarioSaveDefaultArgs;
export const scenarioDetailArgs = {
  select: {
    id: true,
    title: true,
    primaryDomain: {
      select: {
        id: true,
        slug: true,
        imageUrl: true,
        title: true,
        backgroundImageUrl: true,
      },
    },
    secondaryDomain: {
      select: {
        id: true,
        slug: true,
        imageUrl: true,
        title: true,
        backgroundImageUrl: true,
      },
    },

    scenarioLikes: {
      ...scenarioLikeArgs,
    },
    scenarioSaves: {
      select: {
        id: true,
      },
    },
    defaultActorId: true,
    description: true,
    imageUrl: true,
    variables: true,
    successCriteria: true,
    contentWarnings: true,
    supportNote: true,
    xpReward: true,
    setting: true,
    userRole: true,
    userGoal: true,
    openingMessage: true,
    actorRelationshipType: true,
    shortDescription: true,
    slug: true,
    difficulty: true,
    focusSkills: true,
    actorRole: true,
    sampleConversation: true,
    encounters: {
      select: {
        id: true,
        status: true,
        variableValues: true,
        createdAt: true,
        completedAt: true,
        userId: true,
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        review: {
          select: {
            skillScores: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    },
    defaultActor: true,
  },
} satisfies Prisma.ScenarioDefaultArgs;

export function scenarioDetailArgsForUser(userId: string) {
  return {
    select: {
      ...scenarioDetailArgs.select,
      encounters: {
        where: { userId },
        select: {
          ...scenarioDetailArgs.select.encounters.select,
          id: true,
          review: {
            select: {
              skillScores: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc" as const,
        },
      },
    },
  } satisfies Prisma.ScenarioDefaultArgs;
}

export const scenarioPreviewArgs = {
  select: {
    id: true,
    title: true,
    slug: true,
    encounters: {
      select: {
        id: true,
        status: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    },
    description: true,
    setting: true,
    userGoal: true,
    focusSkills: true,
    difficulty: true,
    actorRole: true,
    actorRelationshipType: true,
    defaultActor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    },
    sampleConversation: true,
  },
} satisfies Prisma.ScenarioDefaultArgs;

export const relatedScenarioArgs = {
  select: {
    ...scenarioCardArgs.select,
    domains: {
      select: {
        domainId: true,
      },
    },
  },
} satisfies Prisma.ScenarioDefaultArgs;

export type ScenarioCardRecord = Prisma.ScenarioGetPayload<
  typeof scenarioCardArgs
>;

export type ScenarioDetailRecord = Prisma.ScenarioGetPayload<
  typeof scenarioDetailArgs
>;

export type ScenarioPreviewRecord = Prisma.ScenarioGetPayload<
  typeof scenarioPreviewArgs
>;
export type RelatedScenarioRecord = Prisma.ScenarioGetPayload<
  typeof relatedScenarioArgs
>;
export type ScenarioLikeRecord = Prisma.ScenarioLikeGetPayload<
  typeof scenarioLikeArgs
>;
export type ScenarioSaveRecord = Prisma.ScenarioSaveGetPayload<
  typeof scenarioSaveArgs
>;
