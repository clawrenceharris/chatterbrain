function toDateKey(value: string): string {
  return value.slice(0, 10);
}

export class StreakCalculator {
  static fromPracticeDates(practiceDates: string[]): number {
    if (practiceDates.length === 0) return 0;

    const uniqueDates = [...new Set(practiceDates.map(toDateKey))].sort();
    let streak = 1;
    let bestStreak = 1;

    for (let index = 1; index < uniqueDates.length; index += 1) {
      const previous = new Date(`${uniqueDates[index - 1]}T00:00:00.000Z`);
      const current = new Date(`${uniqueDates[index]}T00:00:00.000Z`);
      const dayDiff = Math.round(
        (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (dayDiff === 1) {
        streak += 1;
        bestStreak = Math.max(bestStreak, streak);
      } else if (dayDiff > 1) {
        streak = 1;
      }
    }

    const today = toDateKey(new Date().toISOString());
    const latest = uniqueDates[uniqueDates.length - 1];
    const daysSinceLatest = Math.round(
      (new Date(`${today}T00:00:00.000Z`).getTime() -
        new Date(`${latest}T00:00:00.000Z`).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysSinceLatest > 1) return 0;
    return bestStreak;
  }
}
