"use client";
import type {
  ScenarioDetailActor,
  ScenarioDetailPageOutput,
} from "@/features/scenario/application/dto";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { ScenarioTag } from "./scenario-tag";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ListCheck,
  Quote,
  Trophy,
  UserPen,
} from "lucide-react";
import { renderTemplate } from "@/shared/utils/renderTemplate";

type ScenarioAboutCardProps = {
  scenario: ScenarioDetailPageOutput;
  actor: ScenarioDetailActor | null;
  onReviewLastEncounter?: () => void;
  onEditActor?: () => void;
};

export function ScenarioAboutCard({
  scenario,
  actor,
  onReviewLastEncounter,
  onEditActor,
}: ScenarioAboutCardProps) {
  const summaryItems = [
    {
      label: "Last played",
      value: scenario.historySummary.lastPlayedLabel,
      icon: <Calendar className="size-4" />,
    },
    {
      label: "Completed",
      value: scenario.historySummary.completedCountLabel,
      icon: <CheckCircle2 className="size-4" />,
    },
    {
      label: "Strongest skill",
      value: scenario.historySummary.strongestSkillLabel,
      icon: <Trophy className="size-4" />,
    },
  ];
  return (
    <div className="relative w-full space-y-3.5 px-5">
      {actor && (
        <section className="border-border flex w-full flex-col gap-3 border-b pb-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">
              Conversation Partner
            </h2>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="size-13 shrink-0">
              <Avatar className="bg-muted size-full">
                <AvatarImage
                  className="size-full object-cover"
                  src={actor.avatarUrl ?? undefined}
                  alt={actor.name}
                />
                <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <p className="font-heading text-foreground text-sm leading-tight font-semibold">
                {actor.name}
              </p>
              <p className="font-heading text-foreground text-sm leading-tight">
                {actor.role}
              </p>
            </div>
            <Button
              size="sm"
              onClick={onEditActor}
              variant="link"
              className="hover:bg-primary/10 ml-auto gap-2 rounded-full hover:no-underline"
            >
              <UserPen />
              Edit Actor
            </Button>
          </div>
          <p className="text-foreground text-sm">{actor.description}</p>
        </section>
      )}
      <section className="border-border flex w-full flex-col gap-3 border-b pb-3.5">
        <h2 className="text-foreground text-lg font-semibold">Difficulty</h2>
        <ScenarioTag
          label={scenario.difficulty.label}
          variant="difficulty"
          className={scenario.difficulty.className}
          icon={scenario.difficulty.icon}
          description={scenario.difficulty.description}
        />
      </section>

      {actor && (
        <section className="border-border flex w-full flex-col gap-3 border-b pb-3.5">
          <h2 className="text-foreground text-lg font-semibold">
            Sample Opener
          </h2>
          <p className="text-foreground inline-flex gap-2 text-sm">
            <Quote
              strokeWidth={0}
              fill="currentColor"
              className="text-primary/70 size-5 scale-x-[-1]"
            />{" "}
            {renderTemplate(actor.openingMessage ?? "", {
              actor_name: actor.name,
            })}
          </p>
        </section>
      )}

      <section className="border-border flex w-full flex-col gap-3">
        <h2 className="text-foreground text-lg font-semibold">Last Practice</h2>
        <div className="space-y-2">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.icon}
              <p className="font-heading inline-flex items-center gap-2 text-sm">
                <span className="text-muted-foreground font-medium">
                  {item.label}:
                </span>
                <span className="text-foreground font-semibold">
                  {item.value}
                </span>
              </p>
            </div>
          ))}
        </div>
        <Button
          className="relative"
          onClick={onReviewLastEncounter}
          variant="outline"
        >
          <ListCheck strokeWidth={2.5} />
          Review Last Encounter
          <ChevronRight
            className="text-muted-foreground absolute top-1/2 right-3 size-5 -translate-y-1/2"
            strokeWidth={3}
          />
        </Button>
      </section>
    </div>
  );
}
