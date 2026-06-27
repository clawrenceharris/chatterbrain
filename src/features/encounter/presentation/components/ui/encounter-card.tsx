import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  CardAction,
} from "@/components/ui";
import { EncounterStatus } from "@/features/encounter/domain/value-objects";
import { cn } from "@/lib/utils";
import { getShortDate } from "@/shared/utils";
import { Eye, MoreVertical, RotateCcw, Trash2 } from "lucide-react";

type EncounterCardProps = {
  encounter: {
    id: string;
    title: string;
    createdAt: string;
    startButtonLabel: string;
    actor: {
      displayName: string;
      avatarUrl: string | null;
    };
    status: {
      value: EncounterStatus;
      label: string;
    };
    scenario: {
      title: string;
      slug: string;
    };
  };
  onReset?: () => void;
  onAbandon?: () => void;
  onStart?: () => void;
  onReview?: () => void;
  className?: string;
};
export function EncounterCard({
  encounter,
  onStart,
  onReview,
  onReset,
  onAbandon,
  className,
}: EncounterCardProps) {
  return (
    <Card
      className={cn(
        "flex w-full max-w-[490px] cursor-pointer flex-col bg-transparent px-0 transition-all",
        className,
      )}
    >
      <CardHeader className="flex items-center justify-between">
        <Avatar>
          <AvatarImage src={encounter.actor.avatarUrl ?? undefined} />
          <AvatarFallback>
            {encounter.actor.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="m-0 line-clamp-1 flex-1 text-lg font-semibold">
          {encounter.scenario.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          {getShortDate(new Date(encounter.createdAt))}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          {encounter.status.value === "completed"
            ? "Review your conversation with " + encounter.actor.displayName
            : encounter.status.value === "active"
              ? "Continue your conversation with " + encounter.actor.displayName
              : "Start your conversation with " + encounter.actor.displayName}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="flex-0.5">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onStart}>
                {encounter.startButtonLabel}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onReset}>
                <RotateCcw /> Reset Encounter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReview}>
                <Eye /> Review Encounter
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onAbandon}>
                <Trash2 /> Abandon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
        <CardAction className="flex-1">
          <Button variant="primary" className="w-full" onClick={onStart}>
            {encounter.startButtonLabel}
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
