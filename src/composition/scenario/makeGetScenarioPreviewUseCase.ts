import { prisma } from "@/lib/db/prisma";
import { PrismaScenarioReadRepository } from "@/features/scenario/infrastructure/repositories";
import { GetScenarioPreviewUseCase } from "@/features/scenario/application/use-cases/";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";

export function makeGetScenarioPreviewUseCase() {
  const scenarioRepository = new PrismaScenarioReadRepository(prisma);
  const profileRepository = new PrismaProfileReadRepository(prisma);
  return new GetScenarioPreviewUseCase(scenarioRepository, profileRepository);
}
