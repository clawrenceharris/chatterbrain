import { PrismaClient } from "@/lib/db/prisma";
import { ProfileReadRepository } from "../../domain/repositories";
import { profileDetailArgs } from "../queries";
import { PrismaProfileMapper } from "../mappers";
import { ProfileDetailResult, ProfileCardResult } from "../../application/dto";

export class PrismaProfileReadRepository implements ProfileReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findProfileCardById(userId: string): Promise<ProfileCardResult | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile ? PrismaProfileMapper.toCard(profile) : null;
  }

  async findProfileDetailById(
    userId: string,
  ): Promise<ProfileDetailResult | null> {
    const prismaProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      ...profileDetailArgs,
    });
    if (!prismaProfile) return null;
    return PrismaProfileMapper.toDetail(prismaProfile);
  }
  async findProfileDetailByUsername(
    username: string,
  ): Promise<ProfileDetailResult | null> {
    const prismaProfile = await this.prisma.userProfile.findUnique({
      where: { username },
      ...profileDetailArgs,
    });
    if (!prismaProfile) return null;
    return PrismaProfileMapper.toDetail(prismaProfile);
  }
}
