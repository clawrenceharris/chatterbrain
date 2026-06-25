import { ProfileRepository } from "../../domain/repositories";
import { CreateOrUpdateProfileData } from "./types";
import { profileDetailArgs } from "../queries";
import { PrismaClient } from "@/lib/db/prisma";
import { UserProfile } from "../../domain/entities";
import { PrismaProfileMapper } from "../mappers";
import { UpdateProfileCommand } from "../../domain/types";

export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateOrUpdateProfileData): Promise<UserProfile> {
    const record = await this.prisma.userProfile.create({
      data,
      ...profileDetailArgs,
    });
    return PrismaProfileMapper.toDomain(record);
  }

  async update(
    userId: string,
    data: UpdateProfileCommand,
  ): Promise<UserProfile> {
    const record = await this.prisma.userProfile.update({
      where: { userId },
      data,
      ...profileDetailArgs,
    });
    return PrismaProfileMapper.toDomain(record);
  }
  async delete(userId: string): Promise<void> {
    await this.prisma.userProfile.delete({
      where: { userId },
    });
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const record = await this.prisma.userProfile.findFirst({
      where: { userId },
    });
    return record ? true : false;
  }
}
