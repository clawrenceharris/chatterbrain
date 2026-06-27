import { ScenarioCardResult } from "@/features/scenario/application/dto";
import { SearchResultItem } from "../../domain/value-objects/SearchResultItem";
import { SavedSearchResult } from "./SavedSearchResult";
import { DomainCardResult } from "@/features/domain/application/dto";

export type UserSearchResult = {
  encounterCount: number;
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  username: string;
};
export type SearchPageInput = {
  query: string;
  scenarios: ScenarioSearchResult[];
  actors: ActorSearchResult[];
  people: UserSearchResult[];
  recentSearches: SavedSearchResult[];
};
export type SearchPageOutput = {
  query: string;
  scenarios: ScenarioSearchResult[];
  actors: ActorSearchResult[];
  users: UserSearchResult[];
  results: SearchResultItem[];
  recentSearches: SavedSearchResult[];
};

export type ScenarioSearchResult = ScenarioCardResult & {
  primaryDomain: DomainCardResult;
  focusSkills: string[];
};

export type ScenarioSearchResultActor = {
  id: string;
  role: string;
  relationshipType: string;
  displayName: string;
  avatarUrl: string;
};

export type ActorSearchResult = {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  voiceId: string;
  personalityTraits: string[];
};
