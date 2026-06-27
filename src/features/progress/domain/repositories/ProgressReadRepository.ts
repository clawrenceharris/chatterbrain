import type { ProgressEncounter } from "../entities";

export interface ProgressReadRepository {
  findCompletedEncountersWithReviewItems(
    userId: string,
  ): Promise<ProgressEncounter[]>;
}
