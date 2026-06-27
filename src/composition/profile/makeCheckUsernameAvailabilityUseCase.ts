import { prisma } from "@/lib/db/prisma";
import { CheckUsernameUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";

export function makeCheckUsernameAvailabilityUseCase() {
  const userProfileRepository = new PrismaProfileRepository(prisma);
  return new CheckUsernameUseCase(userProfileRepository);
}
