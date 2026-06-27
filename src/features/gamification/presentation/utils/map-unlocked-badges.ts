import { GamificationSummaryAssembler } from "../../application/assemblers/GamificationSummaryAssembler";

export function mapUnlockedBadgeIds(badgeIds: string[]) {
  return GamificationSummaryAssembler.toUnlockedBadges(badgeIds);
}
