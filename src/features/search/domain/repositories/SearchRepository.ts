import {
  UserSearchResult,
  ActorSearchResult,
  ScenarioSearchResult,
} from "../../application/dto";
import { SavedSearchResult } from "../../application/dto";

export interface SearchRepository {
  searchScenarios(query: string): Promise<ScenarioSearchResult[]>;
  searchActors(query: string): Promise<ActorSearchResult[]>;
  searchPeople(query: string): Promise<UserSearchResult[]>;
  findRecommendedScenarios(): Promise<ScenarioSearchResult[]>;
  findRecommendedActors(): Promise<ActorSearchResult[]>;
  findRecommendedPeople(): Promise<UserSearchResult[]>;
  findRecentSearches(): Promise<SavedSearchResult[]>;
  saveSearch(query: string): Promise<void>;
  findSavedSearch(query: string): Promise<SavedSearchResult[]>;
}
