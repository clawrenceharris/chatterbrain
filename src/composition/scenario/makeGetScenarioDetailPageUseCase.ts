import { GetScenarioDetailPageUseCase } from "@/features/scenario/application/use-cases/GetScenarioDetailPageUseCase";
import { PrismaScenarioDetailPageActorRepository } from "@/features/scenario/infrastructure/repositories/PrismaScenarioDetailPageActorRepository";
import { PrismaScenarioReadRepository } from "@/features/scenario/infrastructure/repositories/PrismaScenarioReadRepository";
import { prisma } from "@/lib/db/prisma";

export function makeGetScenarioDetailPageUseCase() {
  const scenarioRepository = new PrismaScenarioReadRepository(prisma);
  const actorRepository = new PrismaScenarioDetailPageActorRepository(prisma);

  return new GetScenarioDetailPageUseCase(scenarioRepository, actorRepository);
}
