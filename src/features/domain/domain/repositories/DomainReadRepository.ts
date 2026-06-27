import type {
  DomainCardResult,
  DomainDetailResult,
  DomainPageEncounter,
  DomainPageScenario,
} from "../../application/dto";

export interface DomainReadRepository {
  findEncountersByDomainSlug(slug: string): Promise<DomainPageEncounter[]>;
  findScenariosByDomainSlug(slug: string): Promise<DomainPageScenario[]>;
  findAll(): Promise<DomainCardResult[]>;
  findDomainDetailBySlug(slug: string): Promise<DomainDetailResult | null>;
}
