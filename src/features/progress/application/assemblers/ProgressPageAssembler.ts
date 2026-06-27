import type { ProgressPageAssemblerInput, ProgressPageOutput } from "../dto";

export class ProgressPageAssembler {
  static toPageOutput(input: ProgressPageAssemblerInput): ProgressPageOutput {
    return {
      totalXp: input.totalXp,
      encounters: input.encounters,
      coreSkillXp: input.coreSkillXp,
      highlights: {
        strongestSkill: input.strongestSkill,
        bestEncounter: input.bestEncounter,
      },
    };
  }
}
