"use client";
import { useModal, useUser } from "@/components/providers";
import { DomainSearchCta } from "@/components/shared";
import { ContentLayout } from "@/components/sidebar";
import { EmptyState, ErrorState } from "@/components/states";
import { Button, ScrollArea, ScrollBar } from "@/components/ui";
import { useActorDetail } from "@/features/actor/presentation/hooks";
import { useDeleteEncounter } from "@/features/encounter/presentation/hooks";
import { useStartEncounter } from "@/features/encounter/presentation/hooks/use-start-encounter";
import {
  ScenarioHeroCard,
  ScenarioStats,
  ScenarioDetailPageSkeleton,
  SampleConversationCard,
} from "@/features/scenario/presentation/components/scenario-detail";
import {
  ScenarioDetailsRail,
  ScenarioDetailsSheet,
} from "@/features/scenario/presentation/components/scenario-detail/scenario-details-rail";
import { ScenarioCard } from "@/features/scenario/presentation/components/ui";
import {
  useLikeScenario,
  useClearEncounterHistory,
  useScenarioLikes,
  useUserSavedScenarios,
  useSaveScenario,
  useScenarioPage,
  useRelatedScenarios,
} from "@/features/scenario/presentation/hooks";
import { useMediaQuery, useModals } from "@/hooks";
import { encounterKeys } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, Menu, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ScenarioPageClientProps = {
  scenarioId: string;
};

export default function ScenarioPageClient({
  scenarioId,
}: ScenarioPageClientProps) {
  const {
    modals: {
      "encounter-onboarding": encounterOnboardingModal,
      "select-actor": selectActorModal,
      confirmation: confirmationModal,
    },
  } = useModals();
  const { closeModal } = useModal();
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const {
    data: scenario,
    isLoading,
    error,
    refetch,
  } = useScenarioPage(scenarioId);
  const { profile: user } = useUser();
  const { likeScenario } = useLikeScenario();
  const { saveScenario } = useSaveScenario();
  const router = useRouter();
  const { data: likes = [] } = useScenarioLikes(scenario?.id ?? null);
  const { data: saves = [] } = useUserSavedScenarios(scenario?.id ?? null);
  const queryClient = useQueryClient();
  const { data: relatedScenarios = [] } = useRelatedScenarios(
    scenario?.id ?? null,
  );
  const activeActorId = selectedActorId ?? scenario?.actor?.id ?? "";
  const { mutate: clearEncounterHistory } = useClearEncounterHistory();
  const { data: activeActor = null } = useActorDetail(activeActorId);
  const { mutate: deleteEncounter } = useDeleteEncounter();
  const { mutateAsync: startEncounter, isPending: isStartingEncounter } =
    useStartEncounter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const shouldHideRail = useMediaQuery("(max-width: 1024px)");
  const [variableValues, setVariableValues] = useState<Record<
    string,
    string
  > | null>(null);
  function openSelectActorModal() {
    selectActorModal.open({
      selectedActorId: activeActorId || undefined,
      onSelect: setSelectedActorId,
    });
  }

  function handleRestartEncounter() {
    if (!scenario?.resumeEncounter) return;
    deleteEncounter(scenario.resumeEncounter.id);
  }

  function handleReviewEncounter() {
    if (!scenario?.lastReviewEncounter) return;
    router.push(`/encounters/${scenario.lastReviewEncounter.id}/results`);
  }

  async function handleStartEncounter() {
    if (!scenario || !activeActorId) return;

    const { encounterId } = await startEncounter({
      scenarioId: scenario.id,
      actorId: activeActorId,
      variableValues,
      userId: user.userId,
    });
    router.push(`/encounters/${encounterId}`);
  }

  function handleResumeEncounter() {
    if (!scenario?.resumeEncounter) return;
    queryClient.invalidateQueries({
      queryKey: encounterKeys.detail(scenario.resumeEncounter.id),
    });
    router.push(`/encounters/${scenario.resumeEncounter.id}`);
  }

  async function handleClearEncounterHistory() {
    if (!scenario) return;
    confirmationModal.open({
      title: "Clear Encounter History",
      description: "Are you sure you want to clear your encounter history?",
      onConfirm: async () => {
        clearEncounterHistory(scenario.id);
      },
    });
  }

  const isLiked = useMemo(
    () => likes.some((like) => like.user.userId === user.userId),
    [likes, user.userId],
  );
  const isSaved = useMemo(
    () => saves.some((save) => save.user.userId === user.userId),
    [saves, user.userId],
  );
  function handleLikeScenario() {
    if (!scenario) return;
    likeScenario({
      userId: user.userId,
      scenarioId: scenario.id,
      isLike: !isLiked,
    });
  }
  function handleSaveScenario() {
    if (!scenario) return;
    saveScenario({
      userId: user.userId,
      scenarioId: scenario.id,
      isSave: !isSaved,
    });
  }
  function openCustomizeModal() {
    if (!scenario || !activeActorId) return;

    encounterOnboardingModal.open({
      scenarioId: scenario.id,
      onSubmit: async (values) => {
        setVariableValues(values);
        closeModal();
      },
    });
  }

  if (isLoading) {
    return <ScenarioDetailPageSkeleton />;
  }

  if (error) {
    return (
      <ContentLayout
        scrollable={false}
        contentContainerClassName="justify-center items-center"
      >
        <ErrorState
          variant="card"
          title="Error loading scenario"
          message={error.message}
          onRetry={refetch}
          onAction={() => router.push("/explore/scenarios")}
          actionLabel="View all scenarios"
        />
      </ContentLayout>
    );
  }

  if (!scenario) {
    return (
      <ContentLayout
        scrollable={false}
        contentContainerClassName="justify-center"
        scrollAreaClassName="overflow-hidden"
      >
        <EmptyState
          variant="card"
          title="Scenario not found"
          message="The scenario you are looking wasn't found in our library. It may have been deleted or never existed."
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      headerRight={
        <div className="flex justify-end gap-2">
          <Button
            className="text-sm"
            size="sm"
            variant="muted"
            onClick={handleSaveScenario}
          >
            <Bookmark
              strokeWidth={3}
              className="size-4"
              fill={isSaved ? "currentColor" : "none"}
            />
            Save
          </Button>
          <Button
            variant="muted"
            size="icon"
            className={cn(
              "hover:text-muted-foreground/70 hover:bg-muted/80",
              isLiked && "text-destructive hover:text-destructive/80",
            )}
            onClick={handleLikeScenario}
          >
            <Heart fill={isLiked ? "currentColor" : "none"} strokeWidth={3} />
          </Button>
          {!shouldHideRail && (
            <Button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              variant="muted"
              size="icon"
            >
              <Menu strokeWidth={3} />
            </Button>
          )}
          {shouldHideRail && (
            <ScenarioDetailsSheet
              scenario={scenario}
              onReviewLastEncounter={handleReviewEncounter}
              onEditActor={openSelectActorModal}
              actor={
                scenario.actor ? { ...scenario.actor, ...activeActor } : null
              }
            />
          )}
        </div>
      }
      className="relative"
      title={scenario.title}
    >
      <div className="flex h-full flex-col space-y-6 py-4">
        <ScenarioStats scenario={scenario} likes={likes} saves={saves} />
        <div className="space-y-10">
          <div
            className={cn(
              "grid gap-6 transition-[grid-template-columns] duration-300 ease-in-out xl:gap-8",
              isSidebarOpen && !shouldHideRail
                ? "grid-cols-[minmax(0,1fr)_380px]"
                : "grid-cols-[minmax(0,1fr)_0] gap-0",
            )}
          >
            <ScenarioHeroCard
              actor={
                scenario.actor ? { ...scenario.actor, ...activeActor } : null
              }
              isStarting={isStartingEncounter}
              onStartEncounter={handleStartEncounter}
              scenario={scenario}
              showHistory={showHistory}
              onToggleHistory={() => setShowHistory((value) => !value)}
              onViewLastReview={handleReviewEncounter}
              onCustomize={openCustomizeModal}
              onResumeEncounter={handleResumeEncounter}
              onClearEncounterHistory={handleClearEncounterHistory}
              onRestartEncounter={handleRestartEncounter}
            />
            {!shouldHideRail && isSidebarOpen && (
              <ScenarioDetailsRail
                isOpen={isSidebarOpen && !shouldHideRail}
                scenario={scenario}
                actor={
                  scenario.actor ? { ...scenario.actor, ...activeActor } : null
                }
                onReviewLastEncounter={handleReviewEncounter}
                onEditActor={openSelectActorModal}
              />
            )}
          </div>

          <section
            className={cn(
              "flex flex-col gap-4 overflow-hidden transition-all duration-300",
              showHistory ? "max-h-96" : "m-0 max-h-0",
            )}
          >
            <div className="mb-4 flex w-full items-center justify-between">
              <h2 className="text-xl font-bold">Your History</h2>

              {scenario.encounters.length > 0 && (
                <Button
                  variant="destructive"
                  size="xs"
                  className="ml-auto"
                  onClick={handleClearEncounterHistory}
                >
                  <Trash2 />
                  Clear History
                </Button>
              )}
            </div>
            <div className="bg-muted/70 h-60 w-full rounded-2xl px-4 py-5">
              {scenario.encounters.length > 0 ? (
                <ScrollArea className="h-full w-full whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    {scenario.encounters.map((encounter) => (
                      <div
                        key={encounter.id}
                        className="border-border/70 bg-card flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-heading font-semibold">
                            {encounter.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {encounter.status.label} with{" "}
                            {encounter.actor?.displayName ?? "your partner"}
                          </p>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {new Date(encounter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="centered">
                  <p className="text-muted-foreground text-sm">
                    You haven&apos;t started any encounters for this scenario
                    yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          {scenario.sampleConversation.length > 0 && activeActor && (
            <SampleConversationCard
              messages={scenario.sampleConversation}
              actor={{
                displayName: activeActor.firstName,
                avatarUrl: activeActor.avatarUrl ?? null,
              }}
              user={{
                name: user.displayName ?? user.username,
                avatarUrl: user.avatarUrl ?? null,
              }}
            />
          )}

          {relatedScenarios.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Related scenarios</h2>

              <div className="bg-muted/70 w-auto rounded-2xl px-4">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max gap-4 py-4">
                    {relatedScenarios.map((relatedScenario) => (
                      <ScenarioCard
                        key={relatedScenario.id}
                        scenario={relatedScenario}
                        className="max-w-[360px]"
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </section>
          ) : null}

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Find more like this</h2>

            {scenario.primaryDomain ? (
              <DomainSearchCta domain={scenario.primaryDomain} />
            ) : null}
          </section>
        </div>
      </div>
    </ContentLayout>
  );
}
