import { PrismaClient } from "@/lib/db/prisma";
import type { ScenarioDetailPageActorRepository } from "../../application/use-cases/GetScenarioDetailPageUseCase";
import { ScenarioDetailPageActor } from "../../application/assemblers";

export class PrismaScenarioDetailPageActorRepository implements ScenarioDetailPageActorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findDefaultActor(
    scenarioId: string,
  ): Promise<ScenarioDetailPageActor | null> {
    const actor = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
      select: {
        defaultActor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            description: true,
            avatarUrl: true,
          },
        },
      },
    });

    return actor?.defaultActor ?? null;
  }

  async findById(actorId: string) {
    const actor = await this.prisma.actor.findUnique({
      where: { id: actorId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        description: true,
        avatarUrl: true,
      },
    });

    return actor;
  }
}
