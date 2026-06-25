import { ProfileReadService } from "@/features/profile/application/services";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeProfileReadService() {
    const profileReadRepository = new PrismaProfileReadRepository(prisma);
    return new ProfileReadService(profileReadRepository);
}