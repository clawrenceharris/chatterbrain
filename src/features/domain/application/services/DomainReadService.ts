import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils";
import type { DomainCardResult, DomainDetailResult } from "../dto";
import type { DomainReadRepository } from "../../domain/repositories";

export class DomainReadService {
  constructor(private readonly repository: DomainReadRepository) {}

  async listDomains(): Promise<Result<DomainCardResult[]>> {
    try {
      return ok(await this.repository.findAll());
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getDomainDetailBySlug(
    slug: string,
  ): Promise<Result<DomainDetailResult | null>> {
    try {
      return ok(await this.repository.findDomainDetailBySlug(slug));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
