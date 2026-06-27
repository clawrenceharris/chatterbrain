import type { BadgeGalleryItem } from "@/features/gamification/application/dto";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Lock } from "lucide-react";

const TIER_STYLES = {
  bronze: "border-amber-500/30 bg-amber-500/8",
  silver: "border-slate-400/30 bg-slate-400/8",
  gold: "border-yellow-500/40 bg-yellow-500/10",
} as const;

type BadgeGalleryProps = {
  badges: BadgeGalleryItem[];
};

export function BadgeGallery({ badges }: BadgeGalleryProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-muted-foreground text-lg font-medium">Badges</h2>
          <p className="text-muted-foreground text-sm">
            Unlock badges by practicing, earning XP, and building streaks.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <li key={badge.id}>
            <div
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 transition-all",
                badge.isUnlocked
                  ? TIER_STYLES[badge.tier]
                  : "border-border bg-muted/20 opacity-80",
              )}
            >
              <div className="relative size-16 shrink-0">
                <Image
                  src={badge.image}
                  alt=""
                  className={cn(
                    "size-full object-contain",
                    !badge.isUnlocked && "opacity-35 grayscale",
                  )}
                />
                {!badge.isUnlocked && (
                  <span className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full">
                    <Lock className="text-muted-foreground size-4" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{badge.title}</p>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {badge.description}
                </p>
                <p className="text-muted-foreground mt-1 text-xs capitalize">
                  {badge.tier} · {badge.isUnlocked ? "Unlocked" : "Locked"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
