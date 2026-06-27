import {
  Button,
  Card,
  CardHeader,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  Avatar,
  CardContent,
  CardFooter,
  CardAction,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import {
  ScenarioDetailActor,
  ScenarioDetailEncounter,
} from "@/features/scenario/application/dto/ScenarioDetailPageOutput";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  History,
  Loader2,
  MoreVertical,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Target,
  Trash2,
} from "lucide-react";
import { ScenarioTag } from "./scenario-tag";
import { ScenarioDetailDomain } from "@/features/scenario/application/dto/ScenarioDetailResult";

type ScenarioHeroCardProps = {
  scenario: {
    imageUrl: string | null;
    title: string;
    description: string;
    lastReviewEncounter?: {
      id: string;
    } | null;
    difficulty: {
      label: string;
      description: string;
      className: string;
      icon: React.ReactNode;
    };
    focusSkills: string[];
    resumeEncounter?: {
      id: string;
    } | null;
    encounters: ScenarioDetailEncounter[];
    successCriteria: string[];
    playButtonLabel: string;
    primaryDomain: ScenarioDetailDomain;
  };
  actor: ScenarioDetailActor | null;
  onCustomize?: () => void;
  onResume?: () => void;
  onStartEncounter?: () => void;
  onViewLastReview?: () => void;
  onResumeEncounter?: () => void;
  isStarting?: boolean;
  showHistory?: boolean;
  onToggleHistory?: () => void;
  onPreviewEncounter?: () => void;
  onClearEncounterHistory?: () => void;
  onRestartEncounter?: () => void;
};

export function ScenarioHeroCard({
  scenario,
  onCustomize,
  onStartEncounter,
  isStarting,
  showHistory,
  onToggleHistory,
  onResumeEncounter,
  onClearEncounterHistory,
  onRestartEncounter,
  actor,
}: ScenarioHeroCardProps) {
  const backgroundStyle = scenario.imageUrl
    ? { backgroundImage: `url(${scenario.imageUrl})` }
    : scenario.primaryDomain.backgroundImageUrl
      ? { backgroundImage: `url(${scenario.primaryDomain.backgroundImageUrl})` }
      : undefined;
  const initials = actor?.name.slice(0, 1).toUpperCase();

  return (
    <Card className="flex-1 overflow-hidden pt-0 shadow-sm">
      <CardHeader
        className="relative flex min-h-80 items-end justify-center overflow-hidden px-6 pt-10 pb-6"
        style={backgroundStyle}
      >
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            backgroundStyle ? "opacity-100" : "bg-secondary/30",
          )}
          style={backgroundStyle}
          aria-hidden
        />
        {!backgroundStyle && (
          <>
            <div className="bg-secondary/15 absolute top-10 left-10 h-[60px] w-[120px] -rotate-6 rounded-full" />
            <div className="bg-secondary/10 absolute right-20 bottom-[-15px] h-[120px] w-[120px] rounded-full" />
            <div className="bg-secondary/20 absolute bottom-[15px] left-[-15px] h-[36px] w-[72px] -rotate-6 rounded-full" />

            {/* Additional randomly scattered shapes */}
            <div className="bg-secondary/25 absolute top-3 left-1/3 h-[36px] w-[55px] rotate-12 rounded-full" />
            <div className="bg-secondary/10 absolute right-16 bottom-6 h-[28px] w-[44px] -rotate-12 rounded-full" />
            <div className="bg-secondary/30 absolute top-[60px] right-[21px] h-[28px] w-[58px] rotate-32 rounded-full" />
            <div className="bg-secondary/15 -rotate-[ 19deg] absolute top-[90px] left-[75px] h-[18px] w-[37px] rounded-full" />
            <div className="bg-secondary/15 absolute bottom-[50px] left-[35px] h-[24px] w-[44px] rotate-[7deg] rounded-full" />

            <span className="text-secondary/60 absolute bottom-[27px] left-[48px] text-[1.5em]">
              ✦
            </span>
            <span className="text-secondary/60 absolute top-[33px] right-[39px] text-[1.5em]">
              ✦
            </span>
            <span className="text-secondary/50 absolute top-[24px] left-[62px] rotate-12 text-[2em]">
              ✦
            </span>
            <span className="text-secondary/40 absolute right-[73px] bottom-[70px] text-[1.3em]">
              ✦
            </span>
            <span className="text-secondary/70 absolute top-[120px] right-[120px] -rotate-6 text-[2em]">
              ✦
            </span>
          </>
        )}
        <div className="from-secondary/10 to-secondary/50 absolute inset-0 bg-linear-to-b" />
        <div className="bg-card absolute -bottom-13 left-1/2 h-20 w-[120%] -translate-x-1/2 rounded-t-[200%]" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="muted"
              size="icon"
              className="absolute top-6 right-6 shadow-md"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onRestartEncounter}>
              <RotateCcw />
              Restart Encounter
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={onClearEncounterHistory}
            >
              <Trash2 />
              Clear History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="relative z-1 mt-7 space-y-4 px-3 md:px-5">
        <div className="absolute -top-38 left-1/2 z-2 inline-block -translate-x-1/2">
          <Avatar className="border-background relative size-32 border-4 bg-white shadow-sm">
            <div className="bg-secondary/40 absolute inset-0" />
            {actor ? (
              <AvatarImage
                className="z-2 size-full object-cover"
                src={actor.avatarUrl ?? undefined}
                alt={actor.name}
              />
            ) : null}
            <AvatarFallback className="text-secondary-foreground z-2 bg-transparent text-4xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <AvatarBadge>
            <ScenarioTag
              label={scenario.difficulty.label}
              icon={scenario.difficulty.icon}
              className={cn(scenario.difficulty.className, "bg-card shadow-sm")}
              variant="difficulty"
            />
          </AvatarBadge>
        </div>

        <div className="bg-muted/70 border-border/50 mx-auto mt-6 flex w-full max-w-3xl flex-col gap-6 rounded-3xl border p-6 2xl:flex-row 2xl:gap-8 2xl:p-8">
          <div className="flex-1 space-y-4">
            <div className="text-muted-foreground font-heading inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <BookOpen className="size-4.5" strokeWidth={2.5} />
              Scenario Brief
            </div>
            <p className="text-foreground md:text-md text-base leading-relaxed">
              {scenario.description}
            </p>
          </div>

          <div className="border-border/50 w-full shrink-0 space-y-4 border-t pt-6 2xl:w-72 2xl:border-t-0 2xl:border-l 2xl:pt-0 2xl:pl-8">
            <div className="text-muted-foreground font-heading inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <Target className="size-4.5" strokeWidth={2.5} />
              Focus Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {scenario.focusSkills.map((skill) => (
                <ScenarioTag key={skill} label={skill} variant="category" />
              ))}
            </div>
          </div>
          <div className="border-border/50 w-full shrink-0 space-y-4 border-t pt-6 2xl:w-72 2xl:border-t-0 2xl:border-l 2xl:pt-0 2xl:pl-8">
            <div className="text-muted-foreground font-heading inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <CheckCircle className="size-4.5" strokeWidth={2.5} />
              Success Criteria
            </div>
            <div className="grid w-full grid-cols-1 gap-2">
              {scenario.successCriteria.map((criteria) => (
                <ScenarioTag
                  icon={<CheckCircle className="size-4" strokeWidth={2.5} />}
                  key={criteria}
                  label={criteria}
                  variant="successCriteria"
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      {/* <div className="from-primary/10 to-primary/30 border-primary/24 absolute right-52 -bottom-9 h-28 w-28 rounded-full border-3 bg-linear-to-t" />
          <div className="from-primary/10 to-primary/10 absolute top-3 -left-10 h-16 w-16 rounded-full bg-linear-to-t" />
          <div className="from-primary/30 to-primary/10 border-primary/24 absolute -right-8 bottom-10 h-60 w-60 -rotate-6 rounded-full border-3 bg-linear-to-t" />
          <span className="text-primary/60 absolute right-14 bottom-17">✦</span>
          <span className="text-primary/60 absolute top-7 right-54">✦</span> */}

      <CardFooter className="flex w-full flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <CardAction>
            <Button size="sm" variant="outline" onClick={onToggleHistory}>
              <History />
              {showHistory ? "Hide History" : "View History"}
              <ChevronDown
                strokeWidth={3}
                className="text-muted-foreground ml-3"
              />
            </Button>
          </CardAction>

          <CardAction>
            <Button
              disabled={!!scenario.resumeEncounter}
              size="sm"
              variant="outline"
              onClick={onCustomize}
            >
              <SlidersHorizontal />
              Customize
            </Button>
          </CardAction>
        </div>
        <CardAction>
          {!scenario.resumeEncounter && (
            <Button
              size="sm"
              variant="primary"
              onClick={onStartEncounter}
              className="w-full max-w-60"
            >
              {isStarting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                scenario.playButtonLabel
              )}
            </Button>
          )}
        </CardAction>

        {scenario.resumeEncounter && (
          <CardAction>
            <Button
              size="sm"
              variant="primary"
              className="bg-muted text-primary hover:bg-primary/20 border-primary/20 w-full max-w-60 flex-1 border-2"
              onClick={onResumeEncounter}
            >
              <Play fill="currentColor" />
              Resume Encounter
            </Button>
          </CardAction>
        )}
      </CardFooter>
    </Card>
  );
}
