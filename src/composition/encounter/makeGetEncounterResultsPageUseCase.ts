import { GetEncounterResultsPageUseCase } from "@/features/encounter/application/use-cases";
import { PrismaEncounterReadRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetEncounterResultsPageUseCase() {
  const encounterRepository = new PrismaEncounterReadRepository(prisma);
  return new GetEncounterResultsPageUseCase(encounterRepository);
}
