import { PrismaClient } from "@/lib/db/prisma";
import { EncounterPageActorRepository } from "@/features/encounter/application/use-cases/GetEncounterPageUseCase";
import { EncounterPageActor } from "../../application/dto";
import { PrismaEncounterPageActorMapper } from "../mappers";
import { actorDetailArgs } from "../queries";

export class PrismaEncounterPageActorRepository implements EncounterPageActorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findDefaultActor(
    scenarioId: string,
  ): Promise<EncounterPageActor | null> {
    const encounter = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
      select: {
        defaultActor: {
          ...actorDetailArgs,
        },
      },
    });
    return encounter?.defaultActor
      ? PrismaEncounterPageActorMapper.toPageActor(encounter.defaultActor)
      : null;
  }

  async findById(actorId: string): Promise<EncounterPageActor | null> {
    const actor = await this.prisma.actor.findUnique({
      where: { id: actorId },
      ...actorDetailArgs,
    });

    return actor ? PrismaEncounterPageActorMapper.toPageActor(actor) : null;
  }
}
