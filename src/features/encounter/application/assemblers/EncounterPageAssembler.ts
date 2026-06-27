import {
  EncounterPageActor,
  EncounterPageInput,
  EncounterPageOutput,
} from "../dto";
import { EncounterStatus } from "../../domain/value-objects";

function buildActor(actor: EncounterPageActor): EncounterPageActor {
  return {
    id: actor.id,
    displayName: `${actor.displayName}`,
    voiceId: actor.voiceId,
    description: actor.description ?? "",
    personalityTraits: actor.personalityTraits,
    avatarUrl: actor.avatarUrl,
    communicationStyle: actor.communicationStyle,
  };
}
function getStatusLabel(status: EncounterStatus): string {
  if (status === "active") return "In progress";
  if (status === "completed") return "Completed";
  if (status === "abandoned") return "Abandoned";
  if (status === "not_started") return "Not started";
  return "";
}
export class EncounterPageAssembler {
  static toPageOutput(input: EncounterPageInput): EncounterPageOutput {
    return {
      id: input.id,
      status: {
        value: input.status,
        label: getStatusLabel(input.status),
      },
      title: input.title,
      actor: buildActor(input.actor),
      scenario: input.scenario,
      variableValues: input.variableValues,
      conversationHistory: input.conversationHistory,
      conversationPhase: input.conversationPhase,
    };
  }
}
