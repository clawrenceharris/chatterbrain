import { SaveEncounterProgressUseCase } from "@/features/encounter/application/use-cases/SaveEncounterProgressUseCase";
import { PrismaEncounterRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeSaveEncounterProgressUseCase() {
  const encounterRepository = new PrismaEncounterRepository(prisma);
  return new SaveEncounterProgressUseCase(encounterRepository);
}
