import { prisma } from "@/lib/db/prisma";
import { PrismaScenarioRepository } from "@/features/scenario/infrastructure/repositories";
import { LikeScenarioUseCase } from "@/features/scenario/application/use-cases";

export function makeLikeScenarioUseCase(): LikeScenarioUseCase {
  const scenarioRepository = new PrismaScenarioRepository(prisma);
  return new LikeScenarioUseCase(scenarioRepository);
}
