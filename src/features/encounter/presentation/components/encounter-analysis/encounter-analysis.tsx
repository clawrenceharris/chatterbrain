"use client";
import { cn } from "@/lib/utils";
import { AnalysisStep } from "./analysis-step";
import { ConversationTurn } from "@/features/encounter/domain/value-objects";
import { EncounterEngineHeader } from "../encounter-engine";
import { EncounterWithResults } from "@/features/encounter/application/dto";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ScrollArea,
} from "@/components/ui";
import { SkillScoreChip } from "./skill-score-chip";
import { SocialSkill } from "@/types";
import { BadgeUnlockCelebration } from "@/features/gamification/presentation/components";
import { mapUnlockedBadgeIds } from "@/features/gamification/presentation/utils/map-unlocked-badges";

type Step = {
  actor: ConversationTurn;
  user: ConversationTurn;
};

function pairSteps(history: ConversationTurn[]): Step[] {
  const steps: Step[] = [];
  let i = 0;
  while (i < history.length) {
    const current = history[i];
    const next = history[i + 1];
    if (current.role === "actor" && next?.role === "user") {
      steps.push({ actor: current, user: next });
      i += 2;
    } else {
      i += 1;
    }
  }
  return steps;
}

type EncounterAnalysisProps = {
  conversationHistory: ConversationTurn[];
  encounter: EncounterWithResults;
  actor: {
    displayName: string;
    avatarUrl: string | null;
  };
  userAvatarUrl?: string | null;
  className?: string;
};

export function EncounterAnalysis({
  conversationHistory,
  encounter,
  actor,
  userAvatarUrl,
  className,
}: EncounterAnalysisProps) {
  const steps = pairSteps(conversationHistory);

  if (steps.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border-2",
        className,
      )}
    >
      <EncounterEngineHeader
        showControls={false}
        scenario={encounter.scenario}
      />

      {/* Chat window */}
      <ScrollArea className="h-full min-h-0">
        <div className="space-y-4 px-8 py-5">
          <section>
            <BadgeUnlockCelebration
              badges={mapUnlockedBadgeIds(
                encounter.review?.unlockedBadgeIds ?? [],
              )}
            />
          </section>
          <section className="flex flex-col gap-4 rounded-2xl">
            <h2 className="text-foreground/80 text-lg font-bold">
              Step-by-Step Analysis
            </h2>
            <div className="flex min-h-full flex-col gap-4">
              <Accordion collapsible type="single" className="space-y-4">
                {steps.map((step, i) => {
                  const insight = encounter.review?.turnInsights[step.user.id];
                  const scores = insight
                    ? { [insight.criterion]: insight.score }
                    : {};
                  const scoreEntries = Object.entries(scores) as [
                    SocialSkill,
                    number,
                  ][];
                  return (
                    <AccordionItem key={step.actor.id} value={`step-${i + 1}`}>
                      <AccordionTrigger className="border-border flex items-center justify-between border-[1.5px] px-6 py-5 shadow-xs">
                        <div className="flex items-center gap-3">
                          {/* Step header — always visible */}
                          <p className="text-muted-foreground text-sm font-semibold">
                            Step {i + 1}
                          </p>

                          {/* Score chips */}
                          {scoreEntries.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {scoreEntries.map(([skill, score]) => (
                                <SkillScoreChip
                                  key={skill}
                                  skill={skill}
                                  score={score}
                                  compact
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="mt-3">
                        <AnalysisStep
                          actorMessage={step.actor}
                          userMessage={step.user}
                          actorName={actor.displayName}
                          actorAvatarUrl={actor.avatarUrl}
                          userAvatarUrl={userAvatarUrl ?? null}
                          defaultOpen={i === 0}
                          insight={insight}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </section>
          <section className="bg-muted mt-8 flex flex-col gap-4 rounded-2xl px-7 py-5">
            <h2 className="text-primary text-lg font-bold">Summary</h2>
            <p className="text-muted-foreground text-sm">
              {encounter.review?.summary}
            </p>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
