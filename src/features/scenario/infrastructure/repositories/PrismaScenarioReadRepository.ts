import { PrismaClient } from "@/lib/db/prisma";
import { ScenarioReadRepository } from "../../domain/repositories";
import {
  ListScenariosResult,
  ScenarioCardResult,
  ScenarioDetailResult,
  ScenarioPreviewResult,
} from "../../application/dto";
import { PrismaScenarioMapper } from "../mappers";
import {
  scenarioCardArgs,
  scenarioDetailArgs,
  scenarioDetailArgsForUser,
  scenarioLikeArgs,
  scenarioPreviewArgs,
  relatedScenarioArgs,
  scenarioSaveArgs,
} from "../queries";
import type { RelatedScenarioRecord } from "../queries";
import { ScenarioLike, ScenarioSave } from "../../domain/value-objects";

export class PrismaScenarioReadRepository implements ScenarioReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findScenarioCardBySlug(
    slug: string,
  ): Promise<ScenarioCardResult | null> {
    const record = await this.prisma.scenario.findUnique({
      where: { slug },
      ...scenarioCardArgs,
    });
    if (!record) return null;
    return PrismaScenarioMapper.toCard(record);
  }
  async findScenarioPreviewById(
    id: string,
  ): Promise<ScenarioPreviewResult | null> {
    const record = await this.prisma.scenario.findUnique({
      where: { id },
      ...scenarioPreviewArgs,
    });
    if (!record) return null;
    return PrismaScenarioMapper.toPreview(record);
  }

  async findScenarioDetailById(
    id: string,
  ): Promise<ScenarioDetailResult | null> {
    const record = await this.prisma.scenario.findUnique({
      where: { id },
      ...scenarioDetailArgs,
    });

    if (!record) return null;

    return PrismaScenarioMapper.toDetail(record);
  }
  async findScenarioLikes(scenarioId: string): Promise<ScenarioLike[]> {
    const records = await this.prisma.scenarioLike.findMany({
      where: { scenarioId },
      ...scenarioLikeArgs,
    });
    return records.map(PrismaScenarioMapper.toScenarioLike);
  }

  async findScenarioSavesByUser(
    scenarioId: string,
    userId: string,
  ): Promise<ScenarioSave[]> {
    const records = await this.prisma.scenarioSave.findMany({
      where: { scenarioId, userId },
      ...scenarioSaveArgs,
    });
    return records.map(PrismaScenarioMapper.toScenarioSave);
  }
  async findScenarioDetailBySlug(
    slug: string,
  ): Promise<ScenarioDetailResult | null> {
    const record = await this.prisma.scenario.findUnique({
      where: { slug },
      ...scenarioDetailArgs,
    });
    if (!record) return null;
    return PrismaScenarioMapper.toDetail(record);
  }
  async findScenarioDetailByIdForUser(
    scenarioId: string,
    userId: string,
  ): Promise<ScenarioDetailResult | null> {
    const record = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
      ...scenarioDetailArgsForUser(userId),
    });
    if (!record) return null;
    return PrismaScenarioMapper.toDetail(record);
  }

  async listScenarios(): Promise<ListScenariosResult> {
    const records = await this.prisma.scenario.findMany({
      ...scenarioCardArgs,
    });
    return records.map(PrismaScenarioMapper.toCard);
  }

  async listSavedScenarioCardsByUserId(
    userId: string,
  ): Promise<ScenarioCardResult[]> {
    const records = await this.prisma.scenarioSave.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        scenario: scenarioCardArgs,
      },
    });

    return records.map((record) =>
      PrismaScenarioMapper.toCard(record.scenario),
    );
  }

  async listCreatedScenarioCardsByUserId(
    userId: string,
  ): Promise<ScenarioCardResult[]> {
    const records = await this.prisma.scenario.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: "desc" },
      ...scenarioCardArgs,
    });

    return records.map(PrismaScenarioMapper.toCard);
  }
  async listScenarioCards(): Promise<ScenarioCardResult[]> {
    const records = await this.prisma.scenario.findMany({
      ...scenarioCardArgs,
    });
    return records.map(PrismaScenarioMapper.toCard);
  }

  async findScenarioCardById(id: string): Promise<ScenarioCardResult | null> {
    const record = await this.prisma.scenario.findUnique({
      where: { id },
      ...scenarioCardArgs,
    });
    if (!record) return null;
    return PrismaScenarioMapper.toCard(record);
  }

  async findRelatedScenarios(
    scenarioId: string,
    limit = 3,
  ): Promise<ScenarioCardResult[]> {
    const current = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
      select: {
        id: true,
        difficulty: true,
        focusSkills: true,
        domains: {
          select: {
            domainId: true,
          },
        },
      },
    });

    if (!current) return [];

    const candidates = await this.findRelatedScenarioCandidates(scenarioId);
    const currentDomainIds = new Set(
      current.domains.map((domain) => domain.domainId),
    );
    const currentSkills = new Set(current.focusSkills);

    return candidates
      .map((candidate) => ({
        candidate,
        score: this.scoreRelatedScenario(candidate, {
          domainIds: currentDomainIds,
          difficulty: current.difficulty,
          skills: currentSkills,
        }),
      }))
      .filter(({ score }) => score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.candidate.title.localeCompare(b.candidate.title),
      )
      .slice(0, limit)
      .map(({ candidate }) => PrismaScenarioMapper.toCard(candidate));
  }

  private findRelatedScenarioCandidates(scenarioId: string) {
    return this.prisma.scenario.findMany({
      where: {
        id: { not: scenarioId },
        status: "PUBLISHED",
      },
      ...relatedScenarioArgs,
    });
  }

  private scoreRelatedScenario(
    candidate: RelatedScenarioRecord,
    current: {
      domainIds: Set<string>;
      difficulty: RelatedScenarioRecord["difficulty"];
      skills: Set<RelatedScenarioRecord["focusSkills"][number]>;
    },
  ): number {
    const sharedDomainCount = candidate.domains.filter((domain) =>
      current.domainIds.has(domain.domainId),
    ).length;
    const sharedSkillCount = candidate.focusSkills.filter((skill) =>
      current.skills.has(skill),
    ).length;
    const sameDifficulty = candidate.difficulty === current.difficulty ? 1 : 0;

    return sharedDomainCount * 4 + sharedSkillCount * 3 + sameDifficulty;
  }
}
