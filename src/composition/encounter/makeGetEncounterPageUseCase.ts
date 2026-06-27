import { PrismaEncounterReadRepository } from "@/features/encounter/infrastructure/repositories/PrismaEncounterReadRepository";
import { prisma } from "@/lib/db/prisma";
import { GetEncounterPageUseCase } from "@/features/encounter/application/use-cases/GetEncounterPageUseCase";
import { PrismaEncounterPageActorRepository } from "@/features/encounter/infrastructure/repositories";

export function makeGetEncounterPageUseCase() {
  const encounterRepository = new PrismaEncounterReadRepository(prisma);
  const actorRepository = new PrismaEncounterPageActorRepository(prisma);

  return new GetEncounterPageUseCase(encounterRepository, actorRepository);
}
