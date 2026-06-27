import { ReplayEncounterUseCase } from "@/features/encounter/application/use-cases/ReplayEncounterUseCase";
import { PrismaEncounterRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeReplayEncounterUseCase(): ReplayEncounterUseCase {
  const encounterRepository = new PrismaEncounterRepository(prisma);
  return new ReplayEncounterUseCase(encounterRepository);
}
