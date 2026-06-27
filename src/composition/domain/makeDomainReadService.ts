import { DomainReadService } from "@/features/domain/application/services";
import { PrismaDomainReadRepository } from "@/features/domain/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeDomainReadService() {
  const repository = new PrismaDomainReadRepository(prisma);
  return new DomainReadService(repository);
}
