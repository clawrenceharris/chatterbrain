import type { UnlockedBadge } from "@/features/gamification/application/dto";
import { Card, CardContent } from "@/components/ui";
import Image from "next/image";

type BadgeUnlockCelebrationProps = {
  badges: UnlockedBadge[];
};

export function BadgeUnlockCelebration({
  badges,
}: BadgeUnlockCelebrationProps) {
  if (badges.length === 0) return null;

  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="text-primary flex items-center gap-2">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              New badge unlocked!
            </h2>
            <p className="text-muted-foreground text-sm">
              Nice work — your practice is paying off.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:ml-auto">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-background/80 flex min-w-[180px] items-center gap-3 rounded-2xl border px-3 py-2"
            >
              <Image
                src={badge.image}
                alt=""
                className="size-12 object-contain"
              />
              <div>
                <p className="text-sm font-semibold">{badge.title}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {badge.tier} badge
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
