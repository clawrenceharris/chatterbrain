import { GetRelatedScenariosUseCase } from "@/features/scenario/application/use-cases";
import { PrismaScenarioReadRepository } from "@/features/scenario/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetRelatedScenariosUseCase(): GetRelatedScenariosUseCase {
  const scenarioRepository = new PrismaScenarioReadRepository(prisma);
  return new GetRelatedScenariosUseCase(scenarioRepository);
}
