import type { GamificationSummaryOutput } from "@/features/gamification/application/dto";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Flame, Sparkles, Trophy } from "lucide-react";

type GamificationHeroProps = {
  summary: GamificationSummaryOutput;
  className?: string;
};

export function GamificationHero({
  summary,
  className,
}: GamificationHeroProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-4 rounded-3xl p-5 md:grid-cols-[1.2fr_1fr_1fr]",
        className,
      )}
    >
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="relative flex size-20 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-muted"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-primary"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${summary.level.progressPercent * 2.14} 214`}
              />
            </svg>
            <div className="text-center">
              <p className="text-muted-foreground text-xs font-medium">Level</p>
              <p className="text-2xl font-bold">{summary.level.level}</p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-sm font-medium">
              Conversation rank
            </p>
            <p className="text-2xl font-semibold">{summary.totalXp} XP</p>
            <p className="text-muted-foreground text-sm">
              {summary.level.xpToNextLevel} XP to level{" "}
              {summary.level.level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex h-full flex-col justify-center gap-2 p-5">
          <div className="text-primary flex items-center gap-2">
            <Flame className="size-4" />
            <span className="text-sm font-medium">Practice streak</span>
          </div>
          <p className="text-3xl font-semibold">{summary.streakDays} days</p>
          <p className="text-muted-foreground text-sm">
            Keep showing up to unlock streak badges.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex h-full flex-col justify-center gap-2 p-5">
          <div className="text-primary flex items-center gap-2">
            <Trophy className="size-4" />
            <span className="text-sm font-medium">Badges earned</span>
          </div>
          <p className="text-3xl font-semibold">
            {summary.unlockedCount}
            <span className="text-muted-foreground text-lg font-medium">
              /{summary.totalBadges}
            </span>
          </p>
          <p className="text-primary flex items-center gap-1 text-sm">
            <Sparkles className="size-3.5" />
            Collect them all by practicing different skills
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
