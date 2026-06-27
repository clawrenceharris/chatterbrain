"use client";
import { useSearchContext } from "@/features/search/presentation/components/providers";
import { ContentLayout } from "@/components/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useSearchPage } from "@/features/search/presentation/hooks";
import { SearchPageSkeleton } from "@/features/search/presentation/components/ui";
import {
  ActorSearchResult,
  UserSearchResult,
  ScenarioSearchResult,
} from "@/features/search/application/dto";
import { EmptyState } from "@/components/states";
import { ProfileCard } from "@/features/profile/presentation/components/ui";
import { ActorCard } from "@/features/actor/presentation/components/ui";
import { assets } from "@/lib/constants/assets";
import { SearchType } from "@/features/search/domain/value-objects";
import { ScenarioCard } from "@/features/scenario/presentation/components/ui";
import { DomainSearchCta } from "@/components/shared";
import { CatchAllPage } from "@/app/_components/CatchAllPage";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Scenarios",
    value: "scenarios",
  },
  {
    label: "Actors",
    value: "actors",
  },

  {
    label: "Users",
    value: "users",
  },
];

type SearchResultItem =
  | {
      item: ScenarioSearchResult;
      type: "scenarios";
    }
  | {
      item: ActorSearchResult;
      type: "actors";
    }
  | {
      item: UserSearchResult;
      type: "users";
    };

type SearchSection = {
  title: string;
  value: string;
  items: SearchResultItem[];
};
type SearchResultsSectionProps = {
  section: SearchSection;
};
function SearchResultItemCard({ item }: { item: SearchResultItem }) {
  return (
    <>
      {item.type === "scenarios" && (
        <ScenarioCard
          className="border-border border shadow-none"
          scenario={item.item}
        />
      )}
      {item.type === "actors" && <ActorCard actor={item.item} />}
      {item.type === "users" && (
        <ProfileCard
          profile={{ ...item.item, userId: item.item.id }}
          encounterCount={item.item.encounterCount}
        />
      )}
    </>
  );
}
function SearchResultsSection({ section }: SearchResultsSectionProps) {
  return (
    <section className="flex flex-col gap-4 py-5">
      <h3 className="text-lg font-semibold">{section.title}</h3>
      {section.items.length > 0 ? (
        <ul
          className={cn(
            "grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-3",
          )}
        >
          {section.items.map((item) => (
            <li key={item.item.id}>
              <SearchResultItemCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          variant="item"
          className="mx-0"
          itemVariant="outline"
          title={`No ${section.value} found`}
          message={`Your search didn't match any ${section.value}. Try again with different keywords.`}
        />
      )}
    </section>
  );
}
export default function SearchPage() {
  const { query, type, changeSearchType } = useSearchContext();
  const { data, isFetching, isLoading } = useSearchPage(query);
  if (!query) {
    return (
      <CatchAllPage
        title="Search Chatterbrain"
        message="Find social domains, scenarios, actors and more"
        heroImage={assets.tone_analyzer_sticker}
        heroImageAlt="Chatterbrain mascot holding a magnifying glass"
      />
    );
  }
  return (
    <ContentLayout title="Search">
      <h2 className="mb-4 text-xl font-semibold">
        Results for &quot;{query}&quot;
      </h2>
      <Tabs
        onValueChange={(value) => changeSearchType(value as SearchType)}
        value={type ?? "all"}
        className="flex h-full w-full flex-1 flex-col"
      >
        <TabsList variant="line" className="mb-7 w-full max-w-[460px]">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {isLoading || !data ? (
          <SearchPageSkeleton />
        ) : (
          <>
            <TabsContent className="h-full w-full flex-1 space-y-4" value="all">
              {data.scenarios.length > 0 && (
                <DomainSearchCta domain={data.scenarios[0].primaryDomain} />
              )}
              {data.scenarios.length === 0 &&
                data.actors.length === 0 &&
                data.users.length === 0 && (
                  <EmptyState
                    variant="item"
                    className="mx-0"
                    itemVariant="outline"
                    title="No results found"
                    message="Nothing came up for your search. Try again with different keywords."
                  />
                )}

              {data.scenarios.length > 0 && (
                <SearchResultsSection
                  section={{
                    title: "Scenarios",
                    value: "scenarios",
                    items:
                      data.scenarios.map((scenario) => ({
                        item: scenario,
                        type: "scenarios",
                      })) || [],
                  }}
                />
              )}

              {data.actors.length > 0 && (
                <SearchResultsSection
                  section={{
                    title: "Actors",
                    value: "actors",
                    items:
                      data.actors.map((actor) => ({
                        item: actor,
                        type: "actors",
                      })) || [],
                  }}
                />
              )}
              {data.users.length > 0 && (
                <SearchResultsSection
                  section={{
                    title: "Users",
                    value: "users",
                    items:
                      data.users.map((person) => ({
                        item: person,
                        type: "users",
                      })) || [],
                  }}
                />
              )}
            </TabsContent>
            <TabsContent className="h-full w-full flex-1" value="scenarios">
              <SearchResultsSection
                section={{
                  title: "Scenarios",
                  value: "scenarios",
                  items:
                    data.scenarios.map((scenario) => ({
                      item: scenario,
                      type: "scenarios",
                    })) || [],
                }}
              />
            </TabsContent>

            <TabsContent className="h-full w-full flex-1" value="actors">
              <SearchResultsSection
                section={{
                  title: "Actors",
                  value: "actors",
                  items:
                    data.actors.map((actor) => ({
                      item: actor,
                      type: "actors",
                    })) || [],
                }}
              />
            </TabsContent>
            <TabsContent className="h-full w-full flex-1" value="users">
              <SearchResultsSection
                section={{
                  title: "Users",
                  value: "users",
                  items:
                    data.users.map((person) => ({
                      item: person,
                      type: "users",
                    })) || [],
                }}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
      {isFetching && <span className="sr-only">Updating results</span>}
    </ContentLayout>
  );
}
