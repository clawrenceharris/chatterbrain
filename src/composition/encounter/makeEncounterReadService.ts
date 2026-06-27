import { EncounterReadService } from "@/features/encounter/domain/services/EncounterReadService";
import { PrismaEncounterReadRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeEncounterReadService() {
  const repository = new PrismaEncounterReadRepository(prisma);
  return new EncounterReadService(repository);
}
