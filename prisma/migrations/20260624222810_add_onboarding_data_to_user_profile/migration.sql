-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "birthday" TEXT,
ADD COLUMN     "dataConsentAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "pronouns" TEXT;
