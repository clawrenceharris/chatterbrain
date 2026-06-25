import { CompleteOnboardingUseCase } from "@/features/onboarding/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeCompleteOnboardingUseCase() {
  const profileRepository = new PrismaProfileRepository(prisma);
  return new CompleteOnboardingUseCase(profileRepository);
}
