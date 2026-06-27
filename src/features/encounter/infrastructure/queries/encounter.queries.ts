import { Prisma } from "@/lib/db/prisma";

export const encounterDetailArgs = {
  select: {
    id: true,
    scenarioId: true,
    createdAt: true,
    status: true,
    variableValues: true,
    conversationPhase: true,
    scenario: {
      select: {
        id: true,
        slug: true,
        title: true,
        actorRole: true,
        actorRelationshipType: true,
        openingMessage: true,
        variables: true,
        difficulty: true,
        setting: true,
        focusSkills: true,
        description: true,
      },
    },
    turns: {
      orderBy: {
        createdAt: "asc",
      },
    },
    actor: true,
  },
} satisfies Prisma.EncounterDefaultArgs;

export const encounterCardArgs = {
  select: {
    id: true,
    status: true,
    actor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    },
    createdAt: true,
    completedAt: true,
    scenario: {
      select: {
        slug: true,

        actorRole: true,
        id: true,
        title: true,
      },
    },

    review: {
      select: {
        skillScores: true,
      },
    },
  },
} satisfies Prisma.EncounterDefaultArgs;
export const encounterResultsArgs = {
  select: {
    id: true,
    actor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    },
    scenario: {
      select: {
        title: true,
        id: true,
        slug: true,
      },
    },
    review: {
      include: {
        items: true,
      },
    },
    turns: {
      orderBy: {
        createdAt: "asc",
      },
    },
  },
} satisfies Prisma.EncounterDefaultArgs;

export const encounterReviewChatContextArgs = {
  select: {
    id: true,
    userId: true,
    variableValues: true,
    actor: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        description: true,
        personalityTraits: true,
        communicationStyle: true,
      },
    },
    scenario: {
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        setting: true,
        difficulty: true,
        actorRole: true,
        actorRelationshipType: true,
        focusSkills: true,
        userGoal: true,
        userRole: true,
        successCriteria: true,
        variables: true,
      },
    },
    review: {
      include: {
        items: true,
      },
    },
    turns: {
      orderBy: {
        createdAt: "asc",
      },
    },
  },
} satisfies Prisma.EncounterDefaultArgs;

export type EncounterDetailRecord = Prisma.EncounterGetPayload<
  typeof encounterDetailArgs
>;

export type EncounterCardRecord = Prisma.EncounterGetPayload<
  typeof encounterCardArgs
>;
export type EncounterResultsRecord = Prisma.EncounterGetPayload<
  typeof encounterResultsArgs
>;

export type EncounterReviewChatContextRecord = Prisma.EncounterGetPayload<
  typeof encounterReviewChatContextArgs
>;
