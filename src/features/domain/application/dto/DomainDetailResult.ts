import type { DomainCardResult } from "./DomainCardResult";
import { DomainPageScenario } from "./DomainPageDto";

export type DomainDetailResult = DomainCardResult & {
  scenarios: DomainPageScenario[];
  relatedDomains: DomainCardResult[];
  backgroundImageUrl: string | null;
};
