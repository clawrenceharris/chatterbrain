"use client";
import { ContentLayout } from "@/components/sidebar/content-layout";
import { EmptyState, ErrorState } from "@/components/states";
import { EncounterAnalysis } from "@/features/encounter/presentation/components/encounter-analysis";
import { EncounterPageSkeleton } from "@/features/encounter/presentation/components/encounter-engine/encounter-page-skeleton";
import { EncounterReviewChatPanel } from "@/features/encounter/presentation/components/encounter-review-chat";
import { useEncounterResultsPage } from "@/features/encounter/presentation/hooks";
import { useRouter } from "next/navigation";

type EncounterResultsPageClientProps = {
  encounterId: string;
};
export default function EncounterResultsPageClient({
  encounterId,
}: EncounterResultsPageClientProps) {
  const {
    data: encounter,
    isLoading,
    error,
    refetch,
  } = useEncounterResultsPage(encounterId);
  const router = useRouter();

  function handleBack() {
    if (!encounter) return;
    router.push(
      `/scenarios/${encounter.scenario.id}/${encounter.scenario.slug}`,
    );
  }
  if (isLoading) {
    return <EncounterPageSkeleton />;
  }
  if (error) {
    return (
      <ContentLayout
        scrollable={false}
        contentContainerClassName="centered"
        canGoBack
        onBack={handleBack}
        title="Encounter Review"
      >
        <ErrorState title="Error" message={error.message} onRetry={refetch} />
      </ContentLayout>
    );
  }

  if (!encounter) {
    return (
      <ContentLayout
        scrollable={false}
        contentContainerClassName="centered"
        canGoBack
        onBack={handleBack}
        title="Encounter Review"
      >
        <EmptyState
          title="Encounter not found"
          message="The encounter you are looking for does not exist."
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      canGoBack
      onBack={handleBack}
      scrollable={false}
      className="pb-4"
      scrollAreaClassName="p-0 border-0 pr-3  shadow-none"
      contentContainerClassName="h-full min-h-0"
      title="Encounter Review"
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <EncounterAnalysis
            className="min-h-[640px] lg:min-h-0 lg:flex-[1_1_0]"
            encounter={encounter}
            conversationHistory={encounter.conversationHistory}
            actor={encounter.actor}
          />
          <EncounterReviewChatPanel
            className="lg:w-[380px] xl:w-[420px]"
            encounterId={encounter.id}
          />
        </div>
      </div>
    </ContentLayout>
  );
}
