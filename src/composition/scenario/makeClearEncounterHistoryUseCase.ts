import { ClearEncounterHistoryUseCase } from "@/features/scenario/application/use-cases";
import { PrismaScenarioRepository } from "@/features/scenario/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeClearEncounterHistoryUseCase() {
  const scenarioRepository = new PrismaScenarioRepository(prisma);
  return new ClearEncounterHistoryUseCase(scenarioRepository);
}
