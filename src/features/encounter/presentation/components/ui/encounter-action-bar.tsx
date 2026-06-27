import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { EncounterStatus } from "@/features/encounter/domain/value-objects";
import {
  Eye,
  Loader2,
  MoreVertical,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";

type EncounterActionBarProps = {
  encounter: {
    id: string;
    status: {
      label: string;
      value: EncounterStatus;
    };
    createdAt: string;
  };
  isStarting?: boolean;
  onStart?: () => void;
  onCustomize?: () => void;
  onReview?: () => void;
  onAbandon?: () => void;
  onReset?: () => void;
};

export function EncounterActionBar({
  encounter: { status },
  isStarting,
  onStart,
  onReview,
  onAbandon,
  onReset,
}: EncounterActionBarProps) {
  function renderPlayButtonChildren() {
    if (isStarting) {
      return <Loader2 strokeWidth={2.5} className="size-5 animate-spin" />;
    }
    if (status.value === "completed") {
      return (
        <>
          <Play fill="currentColor" />
          Replay Encounter
        </>
      );
    } else if (status.value === "active") {
      return (
        <>
          <Play fill="currentColor" />
          Resume Encounter
        </>
      );
    }
    return (
      <>
        <Play fill="currentColor" />
        Play Encounter
      </>
    );
  }
  return (
    <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
      {status.value === "completed" && (
        <Button variant="outline" className="flex-0.5" onClick={onReview}>
          <Eye />
          Review Encounter
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-0.5">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{renderPlayButtonChildren()}</DropdownMenuItem>

          <DropdownMenuItem onClick={onReset}>
            <RotateCcw /> Reset Encounter
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onAbandon}>
            <Trash2 /> Abandon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="flex-1" onClick={onStart} disabled={isStarting}>
        {renderPlayButtonChildren()}
      </Button>
    </div>
  );
}
