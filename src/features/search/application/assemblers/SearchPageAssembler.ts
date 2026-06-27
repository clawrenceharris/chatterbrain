import { SearchResultItem } from "../../domain/value-objects/SearchResultItem";
import { SavedSearchResult } from "../dto";
import {
  ActorSearchResult,
  UserSearchResult,
  ScenarioSearchResult,
  SearchPageInput,
  SearchPageOutput,
} from "../dto/SearchPageDto";

function buildSearchItems(
  query: string,
  scenarios: ScenarioSearchResult[],
  actors: ActorSearchResult[],
  people: UserSearchResult[],
  recentSearches: SavedSearchResult[],
): SearchResultItem[] {
  return query
    ? [
        ...scenarios.map((scenario) => ({
          id: scenario.id,
          label: scenario.title,
          href: `/scenarios/${scenario.id}/${scenario.slug}`,
          type: "scenarios" as const,
        })),
        ...actors.map((actor) => ({
          id: actor.id,
          label: actor.name,
          href: `/actors/${actor.id}`,
          type: "actors" as const,
        })),
        ...people.map((person) => ({
          id: person.id,
          label: person.displayName ?? person.username,
          href: `/user/${person.username}`,
          type: "users" as const,
        })),
      ]
    : Array.from(
        new Map(
          recentSearches.map((search) => [search.query.toLowerCase(), search]),
        ).values(),
      ).map((search) => ({
        id: search.id,
        label: search.query,
        href: `/search?query=${search.query}`,
        type: "saved" as const,
      }));
}

export class SearchPageAssembler {
  static toPageOutput(input: SearchPageInput): SearchPageOutput {
    return {
      query: input.query,
      results: buildSearchItems(
        input.query,
        input.scenarios,
        input.actors,
        input.people,
        input.recentSearches,
      ),
      scenarios: input.scenarios,
      actors: input.actors,
      users: input.people,
      recentSearches: input.recentSearches,
    };
  }
}
