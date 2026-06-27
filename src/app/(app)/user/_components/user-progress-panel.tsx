import type { GamificationSummaryOutput } from "@/features/gamification/application/dto";
import type { ProgressPageOutput } from "@/features/progress/application/dto";
import { SKILL_ICONS } from "@/features/encounter/presentation/components/encounter-analysis/skill-score-chip";
import { cn } from "@/lib/utils";
import { assets } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Check, Gem, Shield, Sparkles, Star } from "lucide-react";
import {
  findWeakestSkill,
  getLevelTitle,
  getSkillSummary,
  getWeekPracticeStatus,
} from "./user-progress-utils";

type UserProgressPanelProps = {
  progress: ProgressPageOutput;
  gamification: GamificationSummaryOutput;
  progressHref: string;
  className?: string;
};

function PanelCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-card rounded-2xl shadow-sm", className)}>
      {children}
    </div>
  );
}

function PanelHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-4">
      <div className="text-foreground flex items-center gap-2 text-sm font-medium">
        {icon}
        <span>{title}</span>
      </div>
      {action}
    </div>
  );
}

export function UserProgressPanel({
  progress,
  gamification,
  progressHref,
  className,
}: UserProgressPanelProps) {
  const { level } = gamification;
  const levelCeilingXp = level.level * 75;
  const strongestSkill = progress.highlights.strongestSkill;
  const growthSkill = findWeakestSkill(progress.coreSkillXp);
  const recentBadge = [...gamification.badges]
    .filter((badge) => badge.isUnlocked && badge.unlockedAt)
    .sort(
      (left, right) =>
        new Date(right.unlockedAt ?? 0).getTime() -
        new Date(left.unlockedAt ?? 0).getTime(),
    )[0];
  const weekDays = getWeekPracticeStatus(
    progress.encounters
      .map((encounter) => encounter.completedAt)
      .filter((date): date is string => Boolean(date)),
  );
  const StrongestSkillIcon = strongestSkill
    ? SKILL_ICONS[strongestSkill.skill]
    : Shield;
  const GrowthSkillIcon = growthSkill ? SKILL_ICONS[growthSkill.skill] : Shield;

  return (
    <aside className={cn("flex flex-col gap-4", className)}>
      <PanelCard className="from-primary/40 to-secondary/40 overflow-hidden rounded-2xl bg-linear-to-br p-0.5">
        <div className="bg-card h-full w-full flex-1 rounded-xl">
          <div className="from-primary/10 via-secondary/10 to-primary/5 bg-linear-to-br px-4 py-5">
            <div className="flex items-start gap-3">
              <div className="bg-background flex size-16 shrink-0 items-center justify-center rounded-2xl shadow-sm">
                <Image
                  src={assets.logo}
                  alt=""
                  className="size-12 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">Level {level.level}</p>
                <p className="text-muted-foreground text-sm">
                  {getLevelTitle(level.level)}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="bg-background/70 h-3 overflow-hidden rounded-full">
                <div
                  className="from-primary to-secondary h-full rounded-full bg-linear-to-r transition-all"
                  style={{ width: `${level.progressPercent}%` }}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                {gamification.totalXp.toLocaleString()} /{" "}
                {levelCeilingXp.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>
      </PanelCard>

      {recentBadge ? (
        <PanelCard className="p-4">
          <PanelHeader
            icon={<Star className="text-secondary size-4" />}
            title="Recent Badge Unlocked"
            action={
              <Link
                href={progressHref}
                className="text-primary text-sm font-medium hover:underline"
              >
                See all
              </Link>
            }
          />
          <div className="mt-4 flex items-start gap-3">
            <div className="relative size-16 shrink-0">
              <Image
                src={recentBadge.image}
                alt=""
                className="size-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="font-semibold">{recentBadge.title}</p>
                <p className="text-muted-foreground text-sm">
                  {recentBadge.description}
                </p>
              </div>
              <span className="bg-secondary/10 text-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                <Gem className="size-3" />
                100 XP
              </span>
            </div>
          </div>
        </PanelCard>
      ) : null}

      {strongestSkill ? (
        <PanelCard className="p-4">
          <PanelHeader
            icon={<Shield className="text-primary size-4" />}
            title="Strongest Skill"
          />
          <div className="mt-4 flex items-start gap-3">
            <div className="bg-primary flex size-12 shrink-0 items-center justify-center rounded-full">
              <StrongestSkillIcon className="size-5 text-white" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="font-semibold">{strongestSkill.label}</p>
                <p className="text-muted-foreground text-sm">
                  {getSkillSummary(strongestSkill.skill, "strong")}
                </p>
              </div>
              <span className="bg-primary/10 text-primary inline-flex rounded-full px-2.5 py-1 text-xs font-medium">
                {strongestSkill.xp} XP earned
              </span>
            </div>
          </div>
        </PanelCard>
      ) : null}

      {growthSkill ? (
        <PanelCard className="p-4">
          <PanelHeader
            icon={<Sparkles className="text-secondary size-4" />}
            title="Growth Area"
          />
          <div className="mt-4 flex items-start gap-3">
            <div className="bg-secondary/20 flex size-12 shrink-0 items-center justify-center rounded-full">
              <GrowthSkillIcon className="text-secondary size-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="font-semibold">{growthSkill.label}</p>
                <p className="text-muted-foreground text-sm">
                  {getSkillSummary(growthSkill.skill, "growth")}
                </p>
              </div>
              <span className="bg-secondary/10 text-secondary inline-flex rounded-full px-2.5 py-1 text-xs font-medium">
                Keep it up!
              </span>
            </div>
          </div>
        </PanelCard>
      ) : null}

      <PanelCard className="p-4">
        <PanelHeader
          icon={<Sparkles className="text-primary size-4" />}
          title="Your Streak"
          action={
            <span className="text-secondary text-sm font-medium">
              {gamification.streakDays} days
            </span>
          }
        />
        <div className="mt-4 flex items-center justify-between gap-2 px-1">
          {weekDays.map((day) => (
            <div
              key={`${day.label}-${day.isToday ? "today" : "day"}`}
              className="flex flex-col items-center gap-2"
            >
              {day.completed ? (
                <span className="bg-primary flex size-9 items-center justify-center rounded-full text-white">
                  <Check className="size-4" />
                </span>
              ) : day.isToday ? (
                <span className="border-secondary text-secondary flex size-9 items-center justify-center rounded-full border border-dashed text-xs font-semibold">
                  {day.label}
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full text-xs font-semibold">
                  {day.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </PanelCard>
    </aside>
  );
}
