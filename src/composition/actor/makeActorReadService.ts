import { ActorReadService } from "@/features/actor/application/services";
import { PrismaActorReadRepository } from "@/features/actor/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeActorReadService(): ActorReadService {
  const repository = new PrismaActorReadRepository(prisma);
  return new ActorReadService(repository);
}
