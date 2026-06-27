import { UpdateEncounterValuesUseCase } from "@/features/encounter/application/use-cases/UpdateEncounterValuesUseCase";
import { PrismaEncounterRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeUpdateEncounterValuesUseCase(): UpdateEncounterValuesUseCase {
  const encounterRepository = new PrismaEncounterRepository(prisma);
  return new UpdateEncounterValuesUseCase(encounterRepository);
}
