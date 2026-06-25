import { Prisma } from "@/lib/db/prisma";

export const profileDetailArgs = {
  select: {
    userId: true,
    firstName: true,
    lastName: true,
    avatarUrl: true,
    birthday: true,
    gender: true,
    goals: true,
    interests: true,
    dataConsentAcceptedAt: true,
    onboardingCompletedAt: true,
  },
} satisfies Prisma.UserProfileDefaultArgs;
export const profileCardArgs = {
  select: {
    userId: true,
    firstName: true,
    lastName: true,
    avatarUrl: true,
  },
} satisfies Prisma.UserProfileDefaultArgs;

export type ProfileCardRecord = Prisma.UserProfileGetPayload<
  typeof profileCardArgs
>;
export type ProfileDetailRecord = Prisma.UserProfileGetPayload<
  typeof profileDetailArgs
>;
