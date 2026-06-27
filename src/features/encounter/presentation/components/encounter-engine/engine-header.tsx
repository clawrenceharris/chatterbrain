import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui";
import { Info, RotateCcw, Volume2, VolumeXIcon, X } from "lucide-react";

type EncounterEngineHeaderProps = {
  scenario: {
    id: string;
    title: string;
    description?: string | null;
  };
  isVolumeOn?: boolean;
  onToggleAudio?: () => void;
  onExit?: () => void;
  onReplay?: () => void;
  showControls?: boolean;
};
export function EncounterEngineHeader({
  showControls = true,
  scenario,
  onExit,
  onReplay,
  onToggleAudio,
  isVolumeOn,
}: EncounterEngineHeaderProps) {
  return (
    <div className="flex-cb bg-card border-b px-6 py-3">
      <div className="flex-cc gap-2">
        <h2 className="font-heading">{scenario.title}</h2>
        {scenario.description && (
          <HoverCard>
            <HoverCardTrigger className="text-muted-foreground">
              <Info size={14} />
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-muted-foreground text-sm">
                {scenario.description}
              </p>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      {showControls && (
        <div className="game-controls flex-cc gap-2">
          <Button
            onClick={onToggleAudio}
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground border-muted border-2"
            size="icon"
          >
            {isVolumeOn ? <Volume2 size={20} /> : <VolumeXIcon size={20} />}
          </Button>

          <Button
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground border-muted border-2"
            onClick={onReplay}
            size="icon"
          >
            <RotateCcw size={20} />
          </Button>
          <Button
            onClick={onExit}
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground border-muted border-2"
            size="icon"
          >
            <X size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}
