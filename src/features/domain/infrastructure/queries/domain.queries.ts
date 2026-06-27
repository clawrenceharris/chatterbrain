import { scenarioCardArgs } from "@/features/scenario/infrastructure/queries/scenario.queries";
import { Prisma } from "@/generated/prisma/client";
export const domainCardArgs = {
  select: {
    id: true,
    slug: true,
    title: true,
    description: true,
    imageUrl: true,
  },
} satisfies Prisma.DomainDefaultArgs;
export const domainDetailArgs = {
  select: {
    id: true,
    slug: true,
    title: true,
    description: true,
    imageUrl: true,
    backgroundImageUrl: true,
    relatedDomains: {
      ...domainCardArgs,
    },
    scenarios: {
      select: {
        scenario: {
          ...scenarioCardArgs,
        },
      },
    },
  },
} satisfies Prisma.DomainDefaultArgs;
export const domainPageScenarioArgs = {
  select: {
    id: true,
    slug: true,
    title: true,
    encounters: {
      select: {
        status: true,
      },
    },
    description: true,
    difficulty: true,
    focusSkills: true,
    defaultActor: true,
    imageUrl: true,
    actorRole: true,

    shortDescription: true,
  },
} satisfies Prisma.ScenarioDefaultArgs;
export type DomainCardRecord = Prisma.DomainGetPayload<typeof domainCardArgs>;
export type DomainDetailRecord = Prisma.DomainGetPayload<
  typeof domainDetailArgs
>;
export type DomainPageScenarioRecord = Prisma.ScenarioGetPayload<
  typeof domainPageScenarioArgs
>;
