import {
  CreateScenarioCommand,
  ScenarioRepository,
  UpdateScenarioCommand,
} from "../../domain/repositories";
import { PrismaClient } from "@/lib/db/prisma";
import { CreateScenarioResult } from "../../application/dto";
import { Difficulty } from "@/types";
import {
  scenarioLikeArgs,
  scenarioSaveArgs,
} from "../queries/scenario.queries";
import { ScenarioLike, ScenarioSave } from "../../domain/value-objects";
import { PrismaScenarioMapper } from "../mappers/PrismaScenarioMapper";

export class PrismaScenarioRepository implements ScenarioRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async getScenarioSave(userId: string, scenarioId: string): Promise<boolean> {
    const save = await this.prisma.scenarioSave.findUnique({
      where: { userId_scenarioId: { userId, scenarioId } },
    });
    return save !== null;
  }
  async addScenarioSave(
    userId: string,
    scenarioId: string,
  ): Promise<ScenarioSave> {
    const save = await this.prisma.scenarioSave.create({
      data: { userId, scenarioId },
      ...scenarioSaveArgs,
    });
    return PrismaScenarioMapper.toScenarioSave(save);
  }
  async removeScenarioSave(userId: string, scenarioId: string): Promise<void> {
    await this.prisma.scenarioSave.delete({
      where: { userId_scenarioId: { userId, scenarioId } },
    });
  }
  async getScenarioLike(userId: string, scenarioId: string): Promise<boolean> {
    const like = await this.prisma.scenarioLike.findUnique({
      where: { userId_scenarioId: { userId, scenarioId } },
    });
    return like !== null;
  }
  async addScenarioLike(
    userId: string,
    scenarioId: string,
  ): Promise<ScenarioLike> {
    const like = await this.prisma.scenarioLike.create({
      data: { userId, scenarioId },
      ...scenarioLikeArgs,
    });
    return PrismaScenarioMapper.toScenarioLike(like);
  }
  async removeScenarioLike(userId: string, scenarioId: string): Promise<void> {
    await this.prisma.scenarioLike.delete({
      where: { userId_scenarioId: { userId, scenarioId } },
    });
  }
  async updateScenario(id: string, data: UpdateScenarioCommand): Promise<void> {
    const { domainIds, ...scenarioData } = data;
    await this.prisma.scenario.update({
      where: { id },
      data: {
        ...scenarioData,
        domains: domainIds
          ? {
              deleteMany: {},
              create: domainIds.map((domainId) => ({
                domain: { connect: { id: domainId } },
              })),
            }
          : undefined,
      },
    });
  }
  async deleteScenario(id: string): Promise<void> {
    await this.prisma.scenario.delete({
      where: { id },
    });
  }

  async createScenario(
    data: CreateScenarioCommand,
  ): Promise<CreateScenarioResult> {
    const { domainIds, ...scenarioData } = data;
    const scenario = await this.prisma.scenario.create({
      data: {
        ...scenarioData,
        primaryDomain: {
          connect: { id: domainIds[0] },
        },

        domains: {
          create: domainIds.map((domainId) => ({
            domain: { connect: { id: domainId } },
          })),
        },
      },
    });
    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      difficulty: scenario.difficulty as Difficulty,
    };
  }
  async clearEncounterHistory(
    scenarioId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.encounter.deleteMany({
      where: { scenarioId, userId },
    });
  }
}
