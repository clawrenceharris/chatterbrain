import { ContentLayout } from "@/components/sidebar";
import { Skeleton } from "@/components/ui";

function MessageBubbleSkeleton({
  align = "left",
  widthClass = "w-2/3 max-w-md",
}: {
  align?: "left" | "right";
  widthClass?: string;
}) {
  if (align === "right") {
    return (
      <div className="flex justify-end">
        <Skeleton className={`h-14 ${widthClass} rounded-2xl rounded-tr-md`} />
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className={`h-20 ${widthClass} rounded-2xl rounded-tl-md`} />
    </div>
  );
}

export function EncounterPageSkeleton() {
  return (
    <ContentLayout
      className="pb-4"
      scrollable={false}
      scrollAreaClassName="border-0 shadow-none p-0"
      title={<Skeleton className="h-8 w-44 rounded-full" />}
    >
      <div className="from-secondary/5 to-primary/10 flex h-full min-h-128 flex-1 flex-col overflow-hidden rounded-2xl border bg-linear-to-br shadow-xl">
        {/* Header */}
        <div className="flex-cb bg-card rounded-t-2xl border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="size-4 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
        {/* Messages */}
        <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
          <MessageBubbleSkeleton widthClass="w-[72%] max-w-lg" />
          <MessageBubbleSkeleton align="right" widthClass="w-[58%] max-w-sm" />
          <MessageBubbleSkeleton widthClass="w-[64%] max-w-md" />
        </div>
        {/* Composer */}
        <div className="px-6 pb-6 sm:px-10">
          <div className="space-y-3 rounded-2xl p-3 shadow-xl">
            <Skeleton className="h-19 w-full rounded-2xl" />

            <div className="flex gap-2">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
