"use client";

import { ContentLayout } from "@/components/sidebar";
import { EmptyState, ErrorState } from "@/components/states";
import {
  BadgeGallery,
  GamificationHero,
} from "@/features/gamification/presentation/components";
import { useGamificationSummary } from "@/features/gamification/presentation/hooks";
import {
  CoreSkillXpGrid,
  EncounterXpList,
  ProgressHighlights,
  ProgressPageSkeleton,
} from "@/features/progress/presentation/components";
import { useProgressPage } from "@/features/progress/presentation/hooks";
import { useRouter } from "next/navigation";

export default function ProgressPage() {
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
    return (
      <ContentLayout contentContainerClassName="space-y-8" title="Progress">
        <ProgressPageSkeleton />
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout contentContainerClassName="space-y-8" title="Progress">
        <ErrorState
          className="max-w-md"
          variant="item"
          title="Error loading progress"
          message="Sorry, something went wrong while loading your progress."
        />
      </ContentLayout>
    );
  }

  if (!progress || !gamification) {
    return (
      <ContentLayout contentContainerClassName="space-y-8" title="Progress">
        <EmptyState
          variant="item"
          className="mx-0"
          itemVariant="outline"
          title="No progress yet"
          message="Complete your first encounter to start tracking XP and skills."
          actionLabel="Browse scenarios"
          onAction={() => router.push("/scenarios")}
        />
      </ContentLayout>
    );
  }

  const hasProgress = progress.totalXp > 0 || progress.encounters.length > 0;

  return (
    <ContentLayout contentContainerClassName="space-y-8" title="Progress">
      <GamificationHero summary={gamification} />

      {!hasProgress ? (
        <EmptyState
          variant="item"
          className="mx-0"
          itemVariant="outline"
          title="No progress yet"
          message="Complete your first encounter to start tracking XP, skills, and badges."
          actionLabel="Browse scenarios"
          onAction={() => router.push("/scenarios")}
        />
      ) : (
        <>
          <ProgressHighlights
            totalXp={progress.totalXp}
            highlights={progress.highlights}
          />
          <BadgeGallery badges={gamification.badges} />
          <CoreSkillXpGrid
            skills={progress.coreSkillXp}
            strongestSkill={progress.highlights.strongestSkill}
          />
          <EncounterXpList encounters={progress.encounters} />
        </>
      )}
    </ContentLayout>
  );
}
