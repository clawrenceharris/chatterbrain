import { ContentLayout } from "@/components/sidebar";
import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

function ActionBarSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Skeleton className="h-9 w-36 rounded-full" />
      <Skeleton className="h-9 w-32 rounded-full" />
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  );
}

function AboutCardSkeleton() {
  return (
    <div className="space-y-5">
      <Card className="shadow-none">
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-8 w-72 max-w-full rounded-xl" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-11/12 rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border px-4 py-4">
              <Skeleton className="h-5 w-24 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-4/5 rounded-lg" />
            </div>
            <div className="space-y-3 rounded-2xl border px-4 py-4">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5 shadow-none">
        <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-lg" />
            <Skeleton className="h-7 w-72 max-w-full rounded-xl" />
            <Skeleton className="h-4 w-full max-w-lg rounded-lg" />
          </div>
          <Skeleton className="h-11 w-full rounded-full md:w-52" />
        </CardContent>
      </Card>
    </div>
  );
}

function CharacterCardSkeleton() {
  return (
    <Card className="bg-muted/35 min-h-[560px] overflow-hidden py-0 shadow-none lg:min-h-[calc(100vh-7rem)]">
      <CardHeader className="bg-primary/5 relative flex min-h-72 items-end justify-center overflow-hidden px-6 pt-10 pb-6">
        <div className="bg-background/80 absolute inset-x-0 bottom-0 h-20 rounded-t-[50%]" />
        <div className="relative flex flex-col items-center gap-3">
          <Skeleton className="size-32 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center space-y-5 px-7 py-6">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-5 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </CardContent>
    </Card>
  );
}

export function ScenarioDetailPageSkeleton() {
  return (
    <ContentLayout
      title={
        <Skeleton className="h-8 w-72 max-w-[min(100%,18rem)] rounded-xl" />
      }
    >
      <div className="mt-6 grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_368px] xl:gap-8">
        <div className="min-w-0 space-y-5">
          <ActionBarSkeleton />
          <AboutCardSkeleton />
        </div>
        <div className="lg:sticky lg:top-4 lg:min-h-[calc(100vh-7rem)] lg:self-start">
          <CharacterCardSkeleton />
        </div>
      </div>
    </ContentLayout>
  );
}
