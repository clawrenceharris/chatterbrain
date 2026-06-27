import { Loader2 } from "lucide-react";
import {
  InputGroupButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import type { ResolvedHelper } from "@/features/encounter/domain/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

type DialogueToolBarProps = {
  helpers: ResolvedHelper[];
  onHelperClick: (helper: ResolvedHelper) => void | Promise<void>;
};

export function DialogueToolBar({
  helpers,
  onHelperClick,
}: DialogueToolBarProps) {
  if (!helpers.length) return null;

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {helpers.map((helper) => {
        return (
          <TooltipProvider key={helper.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  size="icon-lg"
                  variant="outline"
                  className="rounded-full"
                  disabled={helper.isDisabled || helper.isLoading}
                  aria-label={helper.label}
                  onClick={() => onHelperClick(helper)}
                >
                  {helper.isLoading ? (
                    <Loader2 strokeWidth={2.5} className="animate-spin" />
                  ) : (
                    <Image
                      src={helper.icon}
                      alt={helper.label}
                      width={300}
                      height={300}
                      className={cn(
                        "h-full w-full object-contain",
                        helper.isDisabled ? "grayscale" : "",
                      )}
                    />
                  )}
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>{helper.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
