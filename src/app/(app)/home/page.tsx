"use client";

import { ContentLayout } from "@/components/sidebar";
import { EmptyState, ErrorState } from "@/components/states";
import { EncounterCard } from "@/features/encounter/presentation/components/ui/encounter-card";
import { useHomePage } from "@/features/home/presentation/hooks";
import { ScenarioCard } from "@/features/scenario/presentation/components/ui";
import { useRouter } from "next/navigation";
import { HomePageSkeleton } from "./_components/home-page-skeleton";

export default function HomePage() {
  const router = useRouter();
  const { data, error, isLoading } = useHomePage();

  if (isLoading) {
    return (
      <ContentLayout contentContainerClassName="space-y-8" title="Home">
        <HomePageSkeleton />
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout contentContainerClassName="space-y-8" title="Home">
        <ErrorState
          className="max-w-md"
          variant="item"
          title="Error loading home"
          message="Sorry, something went wrong while loading your home page."
        />
      </ContentLayout>
    );
  }

  if (!data) {
    return (
      <ContentLayout contentContainerClassName="space-y-8" title="Home">
        <EmptyState
          variant="item"
          className="mx-0"
          itemVariant="outline"
          title="Nothing here yet"
          message="Your home feed will appear once you start practicing."
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout contentContainerClassName="space-y-8" title="Home">
      <section className="flex flex-col gap-4">
        <h2 className="text-muted-foreground text-lg font-medium">
          Continue encounter
        </h2>
        {data.continueEncounter ? (
          <EncounterCard
            encounter={data.continueEncounter}
            onStart={() =>
              router.push(`/encounters/${data.continueEncounter!.id}`)
            }
          />
        ) : (
          <EmptyState
            variant="item"
            className="mx-0"
            itemVariant="outline"
            title="No encounter in progress"
            message="Start a scenario from the suggestions below or browse practice."
            actionLabel="Browse scenarios"
            onAction={() => router.push("/scenarios")}
          />
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-muted-foreground text-lg font-medium">
          {data.tryNext.title}
        </h2>
        {data.tryNext.scenario ? (
          <ScenarioCard
            className="max-w-[490px] shadow-none"
            scenario={data.tryNext.scenario}
          />
        ) : (
          <EmptyState
            variant="item"
            className="mx-0"
            itemVariant="outline"
            title="No scenarios available"
            message="Check back soon for new practice scenarios."
            actionLabel="Browse practice"
            onAction={() => router.push("/scenarios")}
          />
        )}
      </section>
    </ContentLayout>
  );
}
