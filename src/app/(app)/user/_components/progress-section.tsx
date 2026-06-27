"use client";

import { ErrorState } from "@/components/states";
import { EmptyState } from "@/components/states/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamificationSummary } from "@/features/gamification/presentation/hooks";
import { useProgressPage } from "@/features/progress/presentation/hooks";
import { useRouter } from "next/navigation";
import { UserProgressPanel } from "./user-progress-panel";

type UserPageProgressSectionProps = {
  username: string;
};

function UserProgressSkeleton() {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[340px] lg:shrink-0">
      <Skeleton className="h-56 rounded-3xl" />
      <Skeleton className="h-40 rounded-3xl" />
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-28 rounded-3xl" />
    </aside>
  );
}

export default function UserPageProgressSection({
  username,
}: UserPageProgressSectionProps) {
  const router = useRouter();
  const {
    data: progress,
    error: progressError,
    isLoading: isProgressLoading,
  } = useProgressPage();
  const {
    data: gamification,
    error: gamificationError,
    isLoading: isGamificationLoading,
  } = useGamificationSummary();

  const isLoading = isProgressLoading || isGamificationLoading;
  const error = progressError ?? gamificationError;

  if (isLoading) {
    return <UserProgressSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        className="max-w-md"
        variant="item"
        title="Error loading progress"
        message="Sorry, something went wrong while loading your progress."
      />
    );
  }

  if (!progress || !gamification) {
    return (
      <EmptyState
        variant="item"
        className="mx-0"
        itemVariant="outline"
        title="No progress yet"
        message="Complete your first encounter to start tracking XP and skills."
        actionLabel="Browse scenarios"
        onAction={() => router.push("/scenarios")}
      />
    );
  }

  return (
    <UserProgressPanel
      progress={progress}
      gamification={gamification}
      progressHref={`/user/${username}/progress`}
    />
  );
}
