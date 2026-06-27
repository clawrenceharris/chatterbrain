import { normalizeError } from "@/shared/utils";
import { ActorReadRepository } from "../../domain/repositories";
import { ActorDetailResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";

export class ActorReadService {
  constructor(private readonly repository: ActorReadRepository) {}

  async getActorDetailById(
    id: string,
  ): Promise<Result<ActorDetailResult | null>> {
    try {
      const actor = await this.repository.findDetailById(id);
      return ok(actor);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
