"use client";

import { ContentLayout } from "@/components/sidebar/content-layout";
import { useScenarios } from "@/features/scenario/presentation/hooks";
import { ScenarioCard } from "@/features/scenario/presentation/components/ui";

export default function ScenariosPageClient() {
  const { data: scenarios = [] } = useScenarios();

  return (
    <ContentLayout title="Scenarios">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-4">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </ContentLayout>
  );
}
