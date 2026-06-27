import { ScenarioReadService } from "@/features/scenario/application/services/ScenarioReadService";
import { PrismaScenarioReadRepository } from "@/features/scenario/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeScenarioReadService() {
  const repository = new PrismaScenarioReadRepository(prisma);
  return new ScenarioReadService(repository);
}
