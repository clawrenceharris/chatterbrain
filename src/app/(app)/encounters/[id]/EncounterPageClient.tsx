"use client";
import { ContentLayout } from "@/components/sidebar/content-layout";
import { EncounterEngine } from "@/features/encounter/presentation/components/encounter-engine";
import { useEncounterContext } from "@/features/encounter/presentation/providers";

export default function EncounterPageClient() {
  const { encounter, handleExit, key } = useEncounterContext();

  return (
    <ContentLayout
      canGoBack
      onBack={handleExit}
      className="pb-4"
      contentContainerClassName="h-full min-h-0"
      scrollable={false}
      scrollAreaClassName="border-0 shadow-none p-0"
      title={
        <div className="flex-cc bg-success/20 text-success border-success/20 gap-2 rounded-full border-2 px-2 py-1">
          <span className="bg-success size-2 rounded-full" />

          <h1 className="text-sm font-medium">Active encounter</h1>
        </div>
      }
    >
      <EncounterEngine key={key} encounter={encounter} />
    </ContentLayout>
  );
}
