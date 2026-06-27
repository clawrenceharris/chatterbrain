"use client";
import type { BadgeUnlockModalProps } from "@/lib/modals/types";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useModal } from "@/components/providers";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const TIER_GLOW = {
  bronze:
    "from-amber-400/30 via-amber-500/10 to-transparent shadow-amber-500/20",
  silver:
    "from-slate-300/35 via-slate-400/10 to-transparent shadow-slate-400/25",
  gold: "from-yellow-400/35 via-yellow-500/15 to-transparent shadow-yellow-500/30",
} as const;

const SPARKLE_OFFSETS = [
  "top-2 left-6",
  "top-8 right-4",
  "bottom-10 left-3",
  "bottom-6 right-8",
  "top-1/2 left-0",
  "top-1/3 right-0",
];

function SparkleBurst() {
  return (
    <>
      {SPARKLE_OFFSETS.map((position, index) => (
        <span
          key={position}
          className={cn("text-primary absolute animate-ping", position)}
          style={{
            animationDelay: `${index * 120}ms`,
            animationDuration: "1.8s",
          }}
        >
          <Sparkles className="size-4 opacity-70" />
        </span>
      ))}
    </>
  );
}

export function BadgeUnlockModal({
  badges,
  onContinue,
  onCancel,
}: BadgeUnlockModalProps) {
  const { closeModal } = useModal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const badge = badges[activeIndex];
  const isLastBadge = activeIndex >= badges.length - 1;

  useEffect(() => {
    setIsRevealed(false);
    const frame = window.requestAnimationFrame(() => {
      setIsRevealed(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex]);

  if (!badge) return null;

  function handleContinue() {
    if (!isLastBadge) {
      setActiveIndex((index) => index + 1);
      return;
    }

    onContinue?.();
    onCancel?.();
    closeModal();
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="overflow-hidden border-0 p-0 sm:max-w-md"
    >
      <div
        className={cn(
          "relative overflow-hidden bg-linear-to-b px-6 py-8",
          TIER_GLOW[badge.tier],
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_55%)]" />

        <DialogHeader className="relative space-y-2 text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Badge unlocked!
          </DialogTitle>
          <DialogDescription>
            {badges.length > 1
              ? `Badge ${activeIndex + 1} of ${badges.length}`
              : "Your practice just earned a new achievement."}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mx-auto my-8 flex size-44 items-center justify-center">
          <div
            className={cn(
              "bg-primary/15 absolute inset-0 rounded-full transition-all duration-700",
              isRevealed ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          />
          <div
            className={cn(
              "bg-primary/10 absolute inset-3 rounded-full transition-all delay-100 duration-700",
              isRevealed ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          />
          {isRevealed && <SparkleBurst />}
          <div
            className={cn(
              "relative transition-all duration-700 ease-out",
              isRevealed
                ? "scale-100 rotate-0 opacity-100"
                : "scale-50 -rotate-12 opacity-0",
            )}
          >
            <Image
              src={badge.image}
              alt=""
              className="size-28 object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        <div
          className={cn(
            "relative space-y-2 text-center transition-all delay-150 duration-500",
            isRevealed
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          <p className="text-xl font-semibold">{badge.title}</p>
          <p className="text-muted-foreground text-sm">{badge.description}</p>
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            {badge.tier} badge
          </p>
        </div>
      </div>

      <DialogFooter className="border-t px-6 py-4">
        <Button className="w-full" variant="primary" onClick={handleContinue}>
          {isLastBadge ? "Awesome!" : "Next badge"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
