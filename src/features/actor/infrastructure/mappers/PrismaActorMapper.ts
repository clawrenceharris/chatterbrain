import { Actor } from "../../domain/entities/Actor";
import { Actor as PrismaActor } from "@/lib/db/prisma";
import { ActorDetailRecord } from "../queries";
import { ActorDetailResult } from "../../application/dto";

export class PrismaActorMapper {
  static toDetail(record: ActorDetailRecord): ActorDetailResult {
    return {
      ...record,
      firstName: `${record.firstName} ${record.lastName}`,
    };
  }
  static toDomain(actor: PrismaActor): Actor {
    return new Actor({
      id: actor.id,
      slug: actor.slug,
      personalityTraits: actor.personalityTraits,
      firstName: actor.firstName,
      lastName: actor.lastName,
      voiceId: actor.voiceId,
      description: actor.description,
    });
  }
}
