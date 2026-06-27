import { PrismaSearchRepository } from "@/features/search/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
import { SaveSearchUseCase } from "@/features/search/application/use-cases";

export function makeSaveSearchUseCase() {
  const repository = new PrismaSearchRepository(prisma);
  return new SaveSearchUseCase(repository);
}
