import type { ReactNode } from "react";
import type {
  ProgressEncounterXp,
  ProgressPageHighlights,
} from "@/features/progress/application/dto";
import { SKILL_ICONS } from "@/features/encounter/presentation/components/encounter-analysis/skill-score-chip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getShortDate } from "@/shared/utils";
import { Star, Trophy } from "lucide-react";

type ProgressHighlightsProps = {
  totalXp: number;
  highlights: ProgressPageHighlights;
};

function HighlightCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="border-border bg-card/60 shadow-none">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <span className="text-primary">{icon}</span>
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BestEncounterSummary({
  encounter,
}: {
  encounter: ProgressEncounterXp;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={encounter.actorAvatarUrl ?? undefined} />
        <AvatarFallback>
          {encounter.actorDisplayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{encounter.scenarioTitle}</p>
        <p className="text-muted-foreground text-sm">
          {encounter.totalXp} XP
          {encounter.completedAt
            ? ` · ${getShortDate(new Date(encounter.completedAt))}`
            : ""}
        </p>
      </div>
    </div>
  );
}

export function ProgressHighlights({
  totalXp,
  highlights,
}: ProgressHighlightsProps) {
  const StrongestSkillIcon = highlights.strongestSkill
    ? SKILL_ICONS[highlights.strongestSkill.skill]
    : Trophy;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <HighlightCard title="Total XP" icon={<Star className="size-4" />}>
        <p className="text-3xl font-semibold">{totalXp}</p>
        <p className="text-muted-foreground text-sm">
          Across completed encounters
        </p>
      </HighlightCard>

      <HighlightCard
        title="Strongest skill"
        icon={<StrongestSkillIcon className="size-4" />}
      >
        {highlights.strongestSkill ? (
          <>
            <p className="text-xl font-semibold">
              {highlights.strongestSkill.label}
            </p>
            <p className="text-muted-foreground text-sm">
              {highlights.strongestSkill.xp} XP earned
            </p>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Complete an encounter to unlock your strongest skill.
          </p>
        )}
      </HighlightCard>

      <HighlightCard
        title="Best encounter"
        icon={<Trophy className="size-4" />}
      >
        {highlights.bestEncounter ? (
          <BestEncounterSummary encounter={highlights.bestEncounter} />
        ) : (
          <p className="text-muted-foreground text-sm">
            Finish a scenario to see your top-scoring encounter.
          </p>
        )}
      </HighlightCard>
    </section>
  );
}
