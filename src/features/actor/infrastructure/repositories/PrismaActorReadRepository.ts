import { PrismaClient } from "@/lib/db/prisma";
import type { ActorReadRepository } from "../../domain/repositories";
import type {
  ActorDetailResult,
  ActorListItemResult,
} from "../../application/dto";
import { Actor } from "../../domain/entities";
import { PrismaActorMapper } from "../mappers";
import { actorDetailArgs } from "../queries";

export class PrismaActorReadRepository implements ActorReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findDetailById(id: string): Promise<ActorDetailResult | null> {
    const actor = await this.prisma.actor.findUnique({
      where: { id },
      ...actorDetailArgs,
    });
    if (!actor) return null;
    return PrismaActorMapper.toDetail(actor);
  }

  async findAll(): Promise<Actor[]> {
    const actors = await this.prisma.actor.findMany({
      orderBy: { firstName: "asc" },
    });
    return actors.map(PrismaActorMapper.toDomain);
  }

  async listAll(): Promise<ActorListItemResult[]> {
    const actors = await this.prisma.actor.findMany({
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        slug: true,
        firstName: true,
        lastName: true,
        description: true,
        avatarUrl: true,
      },
    });

    return actors;
  }
}
