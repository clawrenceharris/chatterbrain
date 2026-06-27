import { SaveScenarioUseCase } from "@/features/scenario/application/use-cases";
import { PrismaScenarioRepository } from "@/features/scenario/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeSaveScenarioUseCase(): SaveScenarioUseCase {
  const scenarioRepository = new PrismaScenarioRepository(prisma);
  return new SaveScenarioUseCase(scenarioRepository);
}
