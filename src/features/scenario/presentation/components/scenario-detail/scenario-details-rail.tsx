import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui";
import {
  ScenarioDetailActor,
  ScenarioDetailPageOutput,
} from "@/features/scenario/application/dto";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Menu,
  MessageCircleWarning,
  Trophy,
  UserPen,
} from "lucide-react";
import { ScenarioTag } from "./scenario-tag";
import { cn } from "@/lib/utils";

type ScenarioDetailsContentProps = {
  scenario: ScenarioDetailPageOutput;
  actor: ScenarioDetailActor | null;
  onReviewLastEncounter?: () => void;
  onEditActor?: () => void;
};
export function ScenarioDetailsContent({
  scenario,
  actor,
  onReviewLastEncounter,
  onEditActor,
}: ScenarioDetailsContentProps) {
  const summaryItems = [
    {
      label: "Last played",
      value: scenario.historySummary.lastPlayedLabel,
      icon: <Calendar className="size-3" />,
    },
    {
      label: "Completed",
      value: scenario.historySummary.completedCountLabel,
      icon: <CheckCircle className="size-3" />,
    },
    {
      label: "Strongest skill",
      value: scenario.historySummary.strongestSkillLabel,
      icon: <Trophy className="size-3" />,
    },
  ];
  return (
    <div className="relative h-full w-full space-y-3">
      {actor && (
        <section className="border-border w-full space-y-3 border-b pb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Conversation Partner
            </h3>
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
              <p
                title={actor.role}
                className="font-heading text-foreground max-w-[120px] truncate text-sm leading-tight"
              >
                {actor.role}
              </p>
            </div>
            <Button
              size="xs"
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
      <section className="border-border w-full border-b pb-5">
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          Difficulty
        </h3>
        <ScenarioTag
          label={scenario.difficulty.label}
          className={scenario.difficulty.className}
          variant="difficulty"
          icon={scenario.difficulty.icon}
          description={scenario.difficulty.description}
        />
      </section>
      {scenario.contentWarnings.length > 0 && (
        <section className="border-border w-full border-b pb-5">
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Content Warnings
          </h3>
          {scenario.contentWarnings.map((contentWarning) => (
            <ScenarioTag
              key={contentWarning}
              label={contentWarning}
              variant="contentWarning"
              icon={
                <MessageCircleWarning className="size-4" strokeWidth={2.5} />
              }
            />
          ))}
        </section>
      )}
      <section className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Last Practice
          </h3>

          {scenario.hasEncounter && (
            <Button
              size="sm"
              className="text-muted-foreground p-0"
              onClick={onReviewLastEncounter}
              variant="link"
            >
              Review Last Encounter
              <ChevronRight strokeWidth={3} />
            </Button>
          )}
        </div>
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
      </section>
    </div>
  );
}

type ScenarioDetailsRailProps = ScenarioDetailsContentProps & {
  isOpen: boolean;
  className?: string;
};
export function ScenarioDetailsRail({
  isOpen,
  className,
  ...props
}: ScenarioDetailsRailProps) {
  return (
    <aside
      className={cn(
        "bg-background sticky top-0 flex h-[calc(100vh-10rem)] w-[390px] flex-col items-center overflow-hidden px-3 ease-in-out",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex h-full w-full flex-col overflow-y-auto px-3 transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <ScenarioDetailsContent {...props} />
      </div>
    </aside>
  );
}

type ScenarioDetailsSheetProps = ScenarioDetailsContentProps;

export function ScenarioDetailsSheet({ ...props }: ScenarioDetailsSheetProps) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="muted" size="icon">
          <Menu strokeWidth={3} />
        </Button>
      </DrawerTrigger>
      <DrawerContent overlayClassName="backdrop-blur-none!">
        <div className="px-4 py-5">
          <ScenarioDetailsContent {...props} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
