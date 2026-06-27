"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { SearchInput } from "@/components/form";
import { EmptyState } from "@/components/states";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import { ScenarioCard } from "@/features/scenario/presentation/components/ui";
import {
  useUserCreatedScenarios,
  useUserLibrarySavedScenarios,
} from "@/features/scenario/presentation/hooks";
import { useSearch } from "@/hooks/use-search";

type ScenarioFilter = "saved" | "created";

const FILTER_LABELS: Record<ScenarioFilter, string> = {
  saved: "Saved",
  created: "Created",
};

function scenarioMatchesQuery(scenario: ScenarioCardResult, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    scenario.title,
    scenario.description,
    scenario.difficulty,
    ...scenario.focusSkills,
    scenario.actor?.displayName ?? "",
    scenario.actor?.role ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

type UserScenariosSectionProps = {
  userId: string;
};

export function UserScenariosSection({ userId }: UserScenariosSectionProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<ScenarioFilter>("saved");
  const {
    data: savedScenarios = [],
    isLoading: isLoadingSaved,
    error: savedError,
  } = useUserLibrarySavedScenarios(userId);
  const {
    data: createdScenarios = [],
    isLoading: isLoadingCreated,
    error: createdError,
  } = useUserCreatedScenarios(userId);

  const scenarios = filter === "saved" ? savedScenarios : createdScenarios;
  const isLoading = filter === "saved" ? isLoadingSaved : isLoadingCreated;
  const error = filter === "saved" ? savedError : createdError;

  const {
    results,
    search,
    query,
    isLoading: isSearching,
  } = useSearch({
    data: scenarios,
    filter: scenarioMatchesQuery,
    minQueryLength: 1,
  });

  const displayedScenarios = useMemo(() => {
    return query.trim().length >= 1 ? results : scenarios;
  }, [query, results, scenarios]);

  return (
    <section className="min-w-0 flex-1 space-y-4">
      <div className="space-y-3">
        <div className="min-w-0 flex-1">
          <SearchInput
            className="border-0"
            value={query}
            onChange={search}
            placeholder="Search scenarios..."
            expanded
            containerClassName="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="muted" className="shrink-0 gap-2">
              {FILTER_LABELS[filter]}
              <ChevronDown strokeWidth={3} className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(FILTER_LABELS) as ScenarioFilter[]).map((value) => (
              <DropdownMenuItem key={value} onClick={() => setFilter(value)}>
                {FILTER_LABELS[value]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading scenarios...</span>
        </div>
      ) : error ? (
        <EmptyState
          variant="item"
          showImage={false}
          itemVariant="outline"
          title="Could not load scenarios"
          message="Sorry, something went wrong while loading this library."
        />
      ) : displayedScenarios.length === 0 ? (
        <EmptyState
          variant="item"
          showImage={false}
          itemVariant="outline"
          title={
            filter === "saved" ? "No saved scenarios" : "No created scenarios"
          }
          message={
            filter === "saved"
              ? "Save scenarios from the catalog to build your library."
              : "Scenarios you create will show up here."
          }
          actionLabel={filter === "saved" ? "Browse scenarios" : undefined}
          onAction={
            filter === "saved" ? () => router.push("/scenarios") : undefined
          }
        />
      ) : (
        <div className="relative">
          {isSearching ? (
            <div className="text-muted-foreground absolute top-0 right-0 flex items-center gap-2 text-sm">
              <Loader2 className="size-3.5 animate-spin" />
              Searching
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {displayedScenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
