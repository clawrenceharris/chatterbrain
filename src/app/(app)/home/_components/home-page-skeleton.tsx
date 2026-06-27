import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
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

function HomeSectionSkeleton({ cardCount = 3 }: { cardCount?: number }) {
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

export function HomePageSkeleton() {
  return (
    <div className="flex h-full w-full flex-1 flex-col space-y-8">
      <HomeSectionSkeleton cardCount={1} />
      <HomeSectionSkeleton cardCount={1} />
    </div>
  );
}
