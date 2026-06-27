import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function HighlightSkeleton() {
  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <Skeleton className="h-4 w-24 rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function ProgressPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <HighlightSkeleton />
        <HighlightSkeleton />
        <HighlightSkeleton />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-28 rounded-lg" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-36 rounded-lg" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
