import { ListActorsUseCase } from "@/features/actor/application/use-cases/ListActorsUseCase";
import { PrismaActorReadRepository } from "@/features/actor/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeListActorsUseCase() {
  const repository = new PrismaActorReadRepository(prisma);
  return new ListActorsUseCase(repository);
}
