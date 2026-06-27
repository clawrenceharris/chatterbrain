import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils/errors";
import type { ApplicationError } from "@/shared/utils/errors";
import type { ActorReadRepository } from "../../domain/repositories";
import type { ActorListItemResult } from "../dto";

export type ListActorsUseCaseResult = Result<
  ActorListItemResult[],
  ApplicationError
>;

export class ListActorsUseCase {
  constructor(private readonly repository: ActorReadRepository) {}

  async execute(): Promise<ListActorsUseCaseResult> {
    try {
      return ok(await this.repository.listAll());
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
