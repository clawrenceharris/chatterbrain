import { SocialSkill } from "@/types";
import { SOCIAL_SKILL_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coffee,
  Eye,
  Heart,
  Lightbulb,
  RefreshCw,
  Scale,
  Shield,
  Smile,
  Sparkles,
  Target,
  Waves,
  Wrench,
  Zap,
} from "lucide-react";

export const SKILL_ICONS: Record<SocialSkill, LucideIcon> = {
  [SocialSkill.EMPATHY]: Heart,
  [SocialSkill.ASSERTIVENESS]: Target,
  [SocialSkill.CLARITY]: Sparkles,
  [SocialSkill.ENGAGEMENT]: Zap,
  [SocialSkill.SOCIAL_AWARENESS]: Eye,
  [SocialSkill.SETTING_BOUNDARIES]: Shield,
  [SocialSkill.REPAIR]: Wrench,
  [SocialSkill.CUE_RECOGNITION]: Lightbulb,
  [SocialSkill.SMALL_TALK]: Coffee,
  [SocialSkill.CONFLICT_NAVIGATION]: Scale,
  [SocialSkill.EMOTIONAL_RECOGNITION]: Smile,
  [SocialSkill.RELEVANCE]: CheckCircle2,
  [SocialSkill.TONE_AWARENESS]: Waves,
  [SocialSkill.FOLLOW_UP]: ArrowRight,
  [SocialSkill.CONVERSATION_FLOW]: Activity,
  [SocialSkill.SOCIAL_TIMING]: Clock,
  [SocialSkill.PERSPECTIVE_TAKING]: RefreshCw,
};

type SkillScoreChipProps = {
  skill: SocialSkill;
  score: number;
  /** compact = icon + score only (for step header) */
  compact?: boolean;
  className?: string;
};

export function SkillScoreChip({
  skill,
  score,
  compact = false,
  className,
}: SkillScoreChipProps) {
  const Icon = SKILL_ICONS[skill];
  const label = SOCIAL_SKILL_LABELS[skill];
  const formatted = score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);

  if (compact) {
    return (
      <span
        className={cn(
          "text-secondary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
          "bg-secondary/10",
          className,
        )}
        title={label}
      >
        <Icon className="size-3 shrink-0" />
        {formatted}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "bg-secondary/8 border-secondary/20 flex items-center justify-between rounded-lg border px-3 py-2",
        className,
      )}
    >
      <span className="text-foreground flex items-center gap-2 text-sm font-medium">
        <Icon className="text-secondary size-4 shrink-0" />
        {label}
      </span>
      <span className="text-secondary text-sm font-bold">{formatted}</span>
    </div>
  );
}
