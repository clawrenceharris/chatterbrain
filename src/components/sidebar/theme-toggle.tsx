import { useTheme } from "../providers";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";
import { AudioWaveform, Brain, CloudLightning, Sun, Waves } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
};
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={className}>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="border-border text-primary border-2 shadow-sm"
                    variant="default"
                    aria-label="Toggle theme"
                  >
                    {theme === "default" ? (
                      <Sun />
                    ) : theme === "brainstorm" ? (
                      <CloudLightning />
                    ) : theme === "brainwave" ? (
                      <AudioWaveform />
                    ) : theme === "brainwashed" ? (
                      <Waves />
                    ) : (
                      <Brain />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Theme</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setTheme("default")}>
            <Sun />
            Default
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("brainstorm")}>
            <CloudLightning />
            Brainstorm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("brainwave")}>
            <AudioWaveform />
            Brainwave
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("brainwashed")}>
            <Waves />
            Brainwashed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("brainiac")}>
            <Brain />
            Brainiac
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
