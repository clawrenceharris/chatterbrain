import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

function SearchScenarioCardSkeleton() {
  return (
    <Card className="border-border border bg-transparent px-0 shadow-none">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
      </CardContent>
    </Card>
  );
}

function SearchActorCardSkeleton() {
  return (
    <Card className="border-border border bg-transparent shadow-none">
      <CardHeader className="flex flex-row items-center gap-2">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
      </CardContent>
    </Card>
  );
}

function SearchResultsSectionSkeleton({
  cardVariant = "scenario",
  cardCount = 3,
}: {
  cardVariant?: "scenario" | "actor";
  cardCount?: number;
}) {
  const CardSkeleton =
    cardVariant === "actor"
      ? SearchActorCardSkeleton
      : SearchScenarioCardSkeleton;

  return (
    <section className="flex flex-col gap-4 py-5">
      <Skeleton className="h-7 w-32 rounded-lg" />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <li key={index}>
            <CardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExploreDomainItemSkeleton() {
  return (
    <div className="flex w-full flex-wrap items-center gap-3.5 rounded-2xl border px-4 py-3.5">
      <Skeleton className="size-25 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-6 w-56 max-w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Skeleton className="mb-4 h-7 w-64 max-w-full rounded-lg" />

      <div className="mb-7 flex w-full max-w-[460px] gap-4 border-b pb-2">
        <Skeleton className="h-8 w-12 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-14 rounded-lg" />
      </div>

      <div className="h-full w-full flex-1 space-y-4">
        <ExploreDomainItemSkeleton />
        <SearchResultsSectionSkeleton cardVariant="scenario" cardCount={3} />
        <SearchResultsSectionSkeleton cardVariant="actor" cardCount={3} />
      </div>
    </div>
  );
}
