import type { ProgressSkillXp } from "@/features/progress/application/dto";
import { SKILL_ICONS } from "@/features/encounter/presentation/components/encounter-analysis/skill-score-chip";
import { cn } from "@/lib/utils";

type CoreSkillXpGridProps = {
  skills: ProgressSkillXp[];
  strongestSkill: ProgressSkillXp | null;
};

export function CoreSkillXpGrid({
  skills,
  strongestSkill,
}: CoreSkillXpGridProps) {
  const maxXp = Math.max(...skills.map((skill) => skill.xp), 1);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-muted-foreground text-lg font-medium">Core skills</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => {
          const Icon = SKILL_ICONS[skill.skill];
          const isStrongest = strongestSkill?.skill === skill.skill;

          return (
            <li key={skill.skill}>
              <div
                className={cn(
                  "border-border bg-card/60 rounded-xl border p-4",
                  isStrongest && "border-primary/40 bg-primary/5",
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="text-primary size-4 shrink-0" />
                    <span className="font-medium">{skill.label}</span>
                  </div>
                  <span className="text-primary text-sm font-semibold">
                    {skill.xp} XP
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${(skill.xp / maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
