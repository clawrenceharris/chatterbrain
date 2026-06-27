import { DeleteEncounterByIdUseCase } from "@/features/encounter/application/use-cases";
import { PrismaEncounterRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeDeleteEncounterByIdUseCase(): DeleteEncounterByIdUseCase {
  const encounterRepository = new PrismaEncounterRepository(prisma);
  return new DeleteEncounterByIdUseCase(encounterRepository);
}
