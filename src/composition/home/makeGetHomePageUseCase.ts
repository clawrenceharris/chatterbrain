import { GetHomePageUseCase } from "@/features/home/application/use-cases";
import { PrismaEncounterReadRepository } from "@/features/encounter/infrastructure/repositories";
import { PrismaScenarioReadRepository } from "@/features/scenario/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetHomePageUseCase() {
  const encounterRepository = new PrismaEncounterReadRepository(prisma);
  const scenarioRepository = new PrismaScenarioReadRepository(prisma);
  return new GetHomePageUseCase(encounterRepository, scenarioRepository);
}
