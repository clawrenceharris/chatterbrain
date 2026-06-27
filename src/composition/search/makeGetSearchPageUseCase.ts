import { GetSearchPageUseCase } from "@/features/search/application/use-cases";
import { PrismaSearchRepository } from "@/features/search/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetSearchPageUseCase() {
  const repository = new PrismaSearchRepository(prisma);
  return new GetSearchPageUseCase(repository);
}
