import { StartEncounterUseCase } from "@/features/encounter/application/use-cases/StartEncounterUseCase";
import { PrismaEncounterRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeStartEncounterUseCase() {
  const encounterRepository = new PrismaEncounterRepository(prisma);
  return new StartEncounterUseCase(encounterRepository);
}
