import { EncounterResultsPageOutput, EncounterResultsPageInput } from "../dto/";

export class EncounterResultsPageAssembler {
  static toPageOutput(
    input: EncounterResultsPageInput,
  ): EncounterResultsPageOutput {
    return {
      id: input.encounter.id,
      scenario: input.encounter.scenario,
      conversationHistory: input.encounter.conversationHistory,
      actor: input.encounter.actor,
      review: input.encounter.review,
    };
  }
}
