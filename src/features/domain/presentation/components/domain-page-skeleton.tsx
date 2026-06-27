import { ContentLayout } from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  Separator,
  Skeleton,
} from "@/components/ui";

function DomainHeroSkeleton() {
  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-3 space-y-3 lg:flex-row">
        <Skeleton className="aspect-square max-w-[200px] flex-[0.5] shrink-0 rounded-lg" />

        <div className="flex-1 space-y-3">
          <div className="flex w-full items-center justify-between gap-3">
            <Skeleton className="h-8 w-2/3 max-w-sm rounded-xl" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-4/5 rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-8 w-48 rounded-xl" />
      <Separator />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </section>
  );
}

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

function SearchResultsSectionSkeleton({
  cardCount = 3,
}: {
  cardCount?: number;
}) {
  return (
    <section className="flex flex-col gap-4 py-5">
      <Skeleton className="h-7 w-32 rounded-lg" />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <li key={index}>
            <SearchScenarioCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DomainPageSkeleton() {
  return (
    <ContentLayout title="Explore Domains">
      <Skeleton className="h-4 w-38 rounded-lg" />

      <DomainHeroSkeleton />
      <div className="mt-5 flex h-full w-full flex-1 flex-col">
        <Skeleton className="mb-4 h-7 w-64 max-w-full rounded-lg" />

        <div className="mb-7 flex w-full max-w-[460px] gap-4 border-b pb-2">
          <Skeleton className="h-8 w-12 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
        </div>

        <div className="h-full w-full flex-1 space-y-4">
          <SearchResultsSectionSkeleton cardCount={3} />
        </div>
      </div>
    </ContentLayout>
  );
}
