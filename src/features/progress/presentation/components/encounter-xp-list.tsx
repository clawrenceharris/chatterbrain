import type { ProgressEncounterXp } from "@/features/progress/application/dto";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getShortDate } from "@/shared/utils";
import { useRouter } from "next/navigation";

type EncounterXpListProps = {
  encounters: ProgressEncounterXp[];
};

export function EncounterXpList({ encounters }: EncounterXpListProps) {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-muted-foreground text-lg font-medium">
        XP by encounter
      </h2>
      {encounters.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Completed encounters with reviews will appear here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {encounters.map((encounter) => (
            <li key={encounter.id}>
              <Card className="border-border bg-card/60 shadow-none">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <Avatar>
                    <AvatarImage src={encounter.actorAvatarUrl ?? undefined} />
                    <AvatarFallback>
                      {encounter.actorDisplayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base font-semibold">
                      {encounter.scenarioTitle}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      with {encounter.actorDisplayName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-lg font-semibold">
                      {encounter.totalXp} XP
                    </p>
                    {encounter.completedAt && (
                      <p className="text-muted-foreground text-xs">
                        {getShortDate(new Date(encounter.completedAt))}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardFooter className="justify-end pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/encounters/${encounter.id}/results`)
                    }
                  >
                    View results
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
