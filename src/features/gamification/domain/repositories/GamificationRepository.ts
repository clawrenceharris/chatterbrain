import type { GamificationActivitySnapshot } from "../entities";

export interface GamificationRepository {
  findActivitySnapshot(
    userId: string,
    currentEncounterId?: string,
  ): Promise<GamificationActivitySnapshot>;
  updateEncounterUnlockedBadges(
    encounterId: string,
    badgeIds: string[],
  ): Promise<void>;
}
