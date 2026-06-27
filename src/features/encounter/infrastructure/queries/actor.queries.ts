import { Prisma } from "@/lib/db/prisma";

export const actorDetailArgs = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    description: true,
    avatarUrl: true,
    voiceId: true,
    personalityTraits: true,
    communicationStyle: true,
  },
} satisfies Prisma.ActorDefaultArgs;

export type ActorDetailRecord = Prisma.ActorGetPayload<typeof actorDetailArgs>;
