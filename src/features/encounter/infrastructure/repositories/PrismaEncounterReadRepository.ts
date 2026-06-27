import type { EncounterReadRepository } from "../../domain/repositories/EncounterReadRepository";
import type {
  EncounterDetailResult,
  EncounterCardResult,
  EncounterWithResults,
} from "../../application/dto";
import { PrismaEncounterMapper } from "../mappers";
import {
  encounterDetailArgs,
  encounterCardArgs,
  encounterReviewChatContextArgs,
  encounterResultsArgs,
} from "../queries";
import { PrismaClient } from "@/lib/db/prisma";
import { Encounter } from "../../domain/entities";

export class PrismaEncounterReadRepository implements EncounterReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findEncountersByUserId(userId: string): Promise<EncounterCardResult[]> {
    const records = await this.prisma.encounter.findMany({
      where: { userId },
      ...encounterCardArgs,
    });
    return records.map(PrismaEncounterMapper.toCard);
  }
  async findEncounterCardByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<EncounterCardResult | null> {
    const record = await this.prisma.encounter.findFirst({
      where: { userId, scenarioId },
      ...encounterCardArgs,
    });
    if (!record) return null;
    return PrismaEncounterMapper.toCard(record);
  }
  async findEncounterDetailById(
    id: string,
  ): Promise<EncounterDetailResult | null> {
    const record = await this.prisma.encounter.findUnique({
      where: { id },
      ...encounterDetailArgs,
    });
    console.log("record:", record);
    if (!record) return null;
    return PrismaEncounterMapper.toDetail(record);
  }

  async findAllEncounters(): Promise<EncounterCardResult[]> {
    const records = await this.prisma.encounter.findMany({
      ...encounterCardArgs,
    });
    return records.map(PrismaEncounterMapper.toCard);
  }
  async findEncounterCardById(id: string): Promise<EncounterCardResult | null> {
    const record = await this.prisma.encounter.findUnique({
      where: { id },
      ...encounterCardArgs,
    });
    if (!record) return null;
    return PrismaEncounterMapper.toCard(record);
  }

  async findEncounterByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<Encounter | null> {
    const record = await this.prisma.encounter.findFirst({
      where: { userId, scenarioId },
    });
    if (!record) return null;
    return PrismaEncounterMapper.toDomain(record);
  }
  async findEncounterResults(id: string): Promise<EncounterWithResults | null> {
    const record = await this.prisma.encounter.findUnique({
      where: { id },
      ...encounterResultsArgs,
    });
    if (!record) return null;
    return PrismaEncounterMapper.toWithResults(record);
  }
  async findEncounterReviewChatContext(id: string, userId: string) {
    const record = await this.prisma.encounter.findFirst({
      where: { id, userId },
      ...encounterReviewChatContextArgs,
    });
    if (!record) return null;
    return PrismaEncounterMapper.toReviewChatContext(record);
  }
  async findDefaultVariableValuesForEncounter(
    userId: string,
  ): Promise<Record<string, string> | null> {
    const record = await this.prisma.userProfile.findUnique({
      where: { userId },
      select: { displayName: true, username: true },
    });
    return record ? { user_name: record.displayName ?? record.username } : null;
  }
  async findEncounterDetailByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<EncounterDetailResult | null> {
    const record = await this.prisma.encounter.findFirst({
      where: { userId, scenarioId },
      ...encounterDetailArgs,
    });
    if (!record) return null;
    return PrismaEncounterMapper.toDetail(record);
  }
}
