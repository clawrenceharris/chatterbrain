import { GetProgressPageUseCase } from "@/features/progress/application/use-cases";
import { PrismaProgressReadRepository } from "@/features/progress/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetProgressPageUseCase() {
  const repository = new PrismaProgressReadRepository(prisma);
  return new GetProgressPageUseCase(repository);
}
