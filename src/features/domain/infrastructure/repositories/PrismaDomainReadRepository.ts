import { PrismaClient } from "@/lib/db/prisma";
import type { DomainReadRepository } from "../../domain/repositories";
import type {
  DomainCardResult,
  DomainDetailResult,
  DomainPageEncounter,
  DomainPageScenario,
} from "../../application/dto";
import { domainDetailArgs, domainPageScenarioArgs } from "../queries";
import { PrismaDomainMapper } from "../mappers";
import { encounterCardArgs } from "@/features/encounter/infrastructure/queries";

export class PrismaDomainReadRepository implements DomainReadRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async findAll(): Promise<DomainCardResult[]> {
    const records = await this.prisma.domain.findMany({
      orderBy: { title: "asc" },
    });

    return records.map(PrismaDomainMapper.toCard);
  }

  async findDomainDetailBySlug(
    slug: string,
  ): Promise<DomainDetailResult | null> {
    const record = await this.prisma.domain.findUnique({
      where: { slug },
      ...domainDetailArgs,
    });

    if (!record) return null;

    return PrismaDomainMapper.toDetail(record);
  }
  async findScenariosByDomainSlug(slug: string): Promise<DomainPageScenario[]> {
    const record = await this.prisma.scenario.findMany({
      where: { domains: { some: { domain: { slug } } } },
      ...domainPageScenarioArgs,
    });

    if (!record) return [];

    return record.map(PrismaDomainMapper.toDomainPageScenario);
  }
  async findEncountersByDomainSlug(
    slug: string,
  ): Promise<DomainPageEncounter[]> {
    const record = await this.prisma.encounter.findMany({
      where: { scenario: { domains: { some: { domain: { slug } } } } },
      ...encounterCardArgs,
    });

    if (!record) return [];

    return record.map(PrismaDomainMapper.toDomainPageEncounter);
  }
}
