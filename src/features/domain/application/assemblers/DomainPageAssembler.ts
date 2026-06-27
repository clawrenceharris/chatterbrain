import type {
  DomainDetailResult,
  DomainPageEncounter,
  DomainPageOutput,
  DomainPageScenario,
} from "../dto";

export class DomainPageAssembler {
  static toPageOutput(
    domain: DomainDetailResult,
    scenarios: DomainPageScenario[],
    encounters: DomainPageEncounter[],
  ): DomainPageOutput {
    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      description: domain.description,
      imageUrl: domain.imageUrl,
      encounters,
      scenarios,
      relatedDomains: [],
    };
  }
}
