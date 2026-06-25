import type { OnboardingSlide } from "@/features/onboarding/domain/types";
import { FieldDescription, FieldTitle } from "@/components/ui";
import { ChevronRight } from "lucide-react";

type OnboardingSlideShellProps = {
  slide: OnboardingSlide;
  onSkip: () => void;
};

export function OnboardingSlideShell({
  slide,
  onSkip,
}: OnboardingSlideShellProps) {
  return (
    <div className="space-y-2 px-3">
      <div className="space-y-2">
        {slide.skippable && (
          <button
            type="button"
            className="text-muted-foreground/60 font-body hover:text-muted-foreground/80 m-0 inline-flex items-center gap-1 p-0 leading-0 font-normal hover:no-underline"
            onClick={onSkip}
          >
            Skip
            <ChevronRight className="size-4" strokeWidth={3} />
          </button>
        )}
        <FieldTitle className="font-heading text-3xl font-bold">
          {slide.title}
        </FieldTitle>
      </div>

      {slide.description && (
        <p className="text-muted-foreground text-base leading-relaxed">
          {slide.description}
        </p>
      )}
      {slide.helperText && (
        <FieldDescription className="text-sm">
          {slide.helperText}
        </FieldDescription>
      )}
    </div>
  );
}
