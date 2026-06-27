import { PrismaDomainReadRepository } from "@/features/domain/infrastructure/repositories";
import { GetDomainPageUseCase } from "@/features/domain/application/use-cases/GetDomainPageUseCase";
import { prisma } from "@/lib/db/prisma";
export function makeGetDomainPageUseCase() {
  const domainReadRepository = new PrismaDomainReadRepository(prisma);
  return new GetDomainPageUseCase(domainReadRepository);
}
