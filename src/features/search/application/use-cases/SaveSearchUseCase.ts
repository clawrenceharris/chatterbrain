import { ApplicationError, normalizeError } from "@/shared/utils";
import { SearchRepository } from "../../domain/repositories";
import { fail, ok, Result } from "@/shared/application";

type SaveSearchUseCaseResult = Result<void, ApplicationError>;
export class SaveSearchUseCase {
  constructor(private readonly repository: SearchRepository) {}

  async execute(query: string): Promise<SaveSearchUseCaseResult> {
    try {
      if (query.trim().toLowerCase().length < 2) {
        return ok(undefined);
      }
      const savedSearches = await this.repository.findSavedSearch(query);
      if (savedSearches.length > 0) {
        return ok(undefined);
      }
      await this.repository.saveSearch(query);
      return ok(undefined);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
