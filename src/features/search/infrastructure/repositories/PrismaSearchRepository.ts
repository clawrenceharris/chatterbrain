import { SearchRepository } from "../../domain/repositories";
import { Prisma, PrismaClient } from "@/lib/db/prisma";
import {
  actorSearchResultArgs,
  personSearchResultArgs,
  scenarioSearchResultArgs,
} from "../queries";
import { PrismaSearchResultMapper } from "../mappers";
import {
  ActorSearchResult,
  UserSearchResult,
  ScenarioSearchResult,
  SavedSearchResult,
} from "../../application/dto";

export class PrismaSearchRepository implements SearchRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async findRecommendedScenarios(): Promise<ScenarioSearchResult[]> {
    const scenarios = await this.prisma.scenario.findMany({
      ...scenarioSearchResultArgs,
    });
    return scenarios.map(PrismaSearchResultMapper.toScenarioSearchResult);
  }
  async findRecommendedActors(): Promise<ActorSearchResult[]> {
    const actors = await this.prisma.actor.findMany({
      ...actorSearchResultArgs,
    });
    return actors.map(PrismaSearchResultMapper.toActorSearchResult);
  }
  async findRecommendedPeople(): Promise<UserSearchResult[]> {
    const people = await this.prisma.userProfile.findMany({
      ...personSearchResultArgs,
    });
    return people.map(PrismaSearchResultMapper.toPersonSearchResult);
  }
  async findRecentSearches(): Promise<SavedSearchResult[]> {
    const recentSearches = await this.prisma.searchHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    return recentSearches.map(PrismaSearchResultMapper.toSavedSearchResult);
  }

  async searchScenarios(query: string): Promise<ScenarioSearchResult[]> {
    const queryParts = query.split(/\s+/).filter(Boolean);
    if (queryParts.length === 0) {
      return [];
    }

    const partFilters = await Promise.all(
      queryParts.map(async (part) => {
        const tagMatchIds = await this.findScenarioIdsWithMatchingTags(part);
        const domainTitleOrDescription = {
          OR: [
            { title: { contains: part, mode: "insensitive" as const } },
            { description: { contains: part, mode: "insensitive" as const } },
          ],
        };

        const orConditions: Prisma.ScenarioWhereInput[] = [
          { title: { contains: part, mode: "insensitive" } },
          { shortDescription: { contains: part, mode: "insensitive" } },
          { description: { contains: part, mode: "insensitive" } },
          { tags: { hasSome: [part] } },
          {
            domains: {
              some: {
                domain: domainTitleOrDescription,
              },
            },
          },
          { primaryDomain: domainTitleOrDescription },
          { secondaryDomain: domainTitleOrDescription },
        ];

        if (tagMatchIds.length > 0) {
          orConditions.push({ id: { in: tagMatchIds } });
        }

        return { OR: orConditions };
      }),
    );

    const scenarios = await this.prisma.scenario.findMany({
      where: { AND: partFilters },
      ...scenarioSearchResultArgs,
    });
    return scenarios.map(PrismaSearchResultMapper.toScenarioSearchResult);
  }

  private async findScenarioIdsWithMatchingTags(
    part: string,
  ): Promise<string[]> {
    const pattern = `%${part}%`;
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Scenario"
      WHERE array_to_string(tags, ' ') ILIKE ${pattern}
    `;
    return rows.map((row) => row.id);
  }
  async searchActors(query: string): Promise<ActorSearchResult[]> {
    const queryParts = query.split(" ").filter(Boolean);
    const actors = await this.prisma.actor.findMany({
      where: {
        AND: queryParts.map((part) => ({
          OR: [
            { firstName: { contains: part, mode: "insensitive" } },
            { lastName: { contains: part, mode: "insensitive" } },
          ],
        })),
      },
      ...actorSearchResultArgs,
    });
    return actors.map(PrismaSearchResultMapper.toActorSearchResult);
  }
  async searchPeople(query: string): Promise<UserSearchResult[]> {
    const queryParts = query.split(" ").filter(Boolean);

    const people = await this.prisma.userProfile.findMany({
      where: {
        AND: queryParts.map((part) => ({
          OR: [
            { displayName: { contains: part, mode: "insensitive" } },
            { username: { contains: part, mode: "insensitive" } },
          ],
        })),
      },
      ...personSearchResultArgs,
    });
    return people.map(PrismaSearchResultMapper.toPersonSearchResult);
  }

  async saveSearch(query: string): Promise<void> {
    await this.prisma.searchHistory.create({
      data: {
        query,
      },
    });
  }

  async findSavedSearch(query: string): Promise<SavedSearchResult[]> {
    const savedSearch = await this.prisma.searchHistory.findFirst({
      where: {
        query: { contains: query, mode: "insensitive" },
      },
    });
    return savedSearch
      ? [PrismaSearchResultMapper.toSavedSearchResult(savedSearch)]
      : [];
  }
}
