import { scenarioCardArgs } from "@/features/scenario/infrastructure/queries";
import { Prisma } from "@/lib/db/prisma";
export const scenarioSearchResultArgs = {
  select: {
    ...scenarioCardArgs.select,
    focusSkills: true,
    primaryDomain: {
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        imageUrl: true,
      },
    },
  },
} satisfies Prisma.ScenarioDefaultArgs;

export const actorSearchResultArgs = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    description: true,
    avatarUrl: true,
    voiceId: true,
    personalityTraits: true,
  },
} satisfies Prisma.ActorDefaultArgs;

export const personSearchResultArgs = {
  select: {
    userId: true,
    displayName: true,
    username: true,
    avatarUrl: true,
    encounters: {
      select: {
        id: true,
      },
    },
  },
} satisfies Prisma.UserProfileDefaultArgs;

export type ScenarioSearchResultRecord = Prisma.ScenarioGetPayload<
  typeof scenarioSearchResultArgs
>;
export type ActorSearchResultRecord = Prisma.ActorGetPayload<
  typeof actorSearchResultArgs
>;
export type PersonSearchResultRecord = Prisma.UserProfileGetPayload<
  typeof personSearchResultArgs
>;
