import type { PrismaClient } from "@/lib/db/prisma";
import type { ProgressReadRepository } from "../../domain/repositories";
import { PrismaProgressMapper } from "../mappers";
import { progressEncounterArgs } from "../queries";

export class PrismaProgressReadRepository implements ProgressReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findCompletedEncountersWithReviewItems(userId: string) {
    const records = await this.prisma.encounter.findMany({
      where: {
        userId,
        status: "COMPLETED",
        review: {
          isNot: null,
        },
      },
      orderBy: {
        completedAt: "desc",
      },
      ...progressEncounterArgs,
    });

    return records.map(PrismaProgressMapper.toDomain);
  }
}
