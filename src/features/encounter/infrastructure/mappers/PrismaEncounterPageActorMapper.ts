import { EncounterPageActor } from "../../application/dto";
import { ActorDetailRecord } from "../queries";
export class PrismaEncounterPageActorMapper {
  static toPageActor(record: ActorDetailRecord): EncounterPageActor {
    return {
      id: record.id,
      displayName: `${record.firstName} ${record.lastName}`,
      description: record.description,
      avatarUrl: record.avatarUrl ?? null,
      voiceId: record.voiceId,
      personalityTraits: record.personalityTraits,
      communicationStyle: record.communicationStyle,
    };
  }
}
