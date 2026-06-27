const XP_PER_LEVEL = 75;

export type UserLevel = {
  level: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  progressPercent: number;
};

export class LevelCalculator {
  static fromTotalXp(totalXp: number): UserLevel {
    const level = Math.max(1, Math.floor(totalXp / XP_PER_LEVEL) + 1);
    const currentLevelFloor = (level - 1) * XP_PER_LEVEL;
    const currentLevelXp = totalXp - currentLevelFloor;
    const xpToNextLevel = level * XP_PER_LEVEL - totalXp;

    return {
      level,
      currentLevelXp,
      xpToNextLevel: Math.max(0, xpToNextLevel),
      progressPercent: Math.min(
        100,
        Math.round((currentLevelXp / XP_PER_LEVEL) * 100),
      ),
    };
  }
}
