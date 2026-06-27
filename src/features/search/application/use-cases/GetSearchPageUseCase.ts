import { fail, ok, Result } from "@/shared/application";
import { SearchRepository } from "../../domain/repositories/SearchRepository";
import { SearchPageOutput } from "../dto";
import { ApplicationError, normalizeError } from "@/shared/utils";
import { SearchPageAssembler } from "../assemblers/SearchPageAssembler";

type GetSearchPageUseCaseResult = Result<SearchPageOutput, ApplicationError>;
export class GetSearchPageUseCase {
  constructor(private readonly repository: SearchRepository) {}

  async execute(query: string | null): Promise<GetSearchPageUseCaseResult> {
    try {
      const normalizedQuery = query?.trim().toLowerCase();
      const recentSearches = await this.repository.findRecentSearches();

      if (!normalizedQuery) {
        return ok(
          SearchPageAssembler.toPageOutput({
            query: "",
            scenarios: [],
            actors: [],
            people: [],
            recentSearches,
          }),
        );
      }

      const scenarios = await this.repository.searchScenarios(normalizedQuery);
      const actors = await this.repository.searchActors(normalizedQuery);
      const people = await this.repository.searchPeople(normalizedQuery);
      return ok(
        SearchPageAssembler.toPageOutput({
          query: normalizedQuery,
          scenarios,
          actors,
          people,
          recentSearches,
        }),
      );
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
