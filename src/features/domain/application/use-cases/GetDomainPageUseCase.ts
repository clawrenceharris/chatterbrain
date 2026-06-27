import { fail, ok, Result } from "@/shared/application/Result";
import { ApplicationError } from "@/shared/utils/errors";
import { normalizeError } from "@/shared/utils/errors";
import { DomainPageOutput } from "../dto";
import { DomainReadRepository } from "../../domain/repositories";
import { AppErrorCode } from "@/types/error.types";
import { DomainPageAssembler } from "../assemblers";

type GetDomainPageUseCaseResult = Result<DomainPageOutput, ApplicationError>;
export class GetDomainPageUseCase {
  constructor(private readonly repository: DomainReadRepository) {}

  async execute(slug: string): Promise<GetDomainPageUseCaseResult> {
    try {
      const domain = await this.repository.findDomainDetailBySlug(slug);

      if (!domain) {
        return fail(
          new ApplicationError({ code: AppErrorCode.RESOURCE_NOT_FOUND }),
        );
      }
      const [scenarios, encounters] = await Promise.all([
        this.repository.findScenariosByDomainSlug(slug),
        this.repository.findEncountersByDomainSlug(slug),
      ]);
      return ok(
        DomainPageAssembler.toPageOutput(domain, scenarios, encounters),
      );
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
