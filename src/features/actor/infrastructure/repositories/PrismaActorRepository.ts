import { PrismaClient } from "@/lib/db/prisma";
import { Actor } from "../../domain/entities/Actor";
import { ActorRepository } from "../../domain/repositories";
import { PrismaActorMapper } from "../mappers";
export class PrismaActorRepository implements ActorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createActor(actor: Actor): Promise<Actor> {
    const prismaActor = await this.prisma.actor.create({
      data: {
        slug: actor.slug,
        firstName: actor.firstName,
        lastName: actor.lastName,
        voiceId: actor.voiceId,
        description: actor.description,
      },
    });
    return PrismaActorMapper.toDomain(prismaActor);
  }
  async updateActor(actor: Actor): Promise<Actor> {
    const prismaActor = await this.prisma.actor.update({
      where: { id: actor.id },
      data: actor,
    });
    return PrismaActorMapper.toDomain(prismaActor);
  }
  async deleteActor(id: string): Promise<void> {
    await this.prisma.actor.delete({
      where: { id },
    });
  }
}
