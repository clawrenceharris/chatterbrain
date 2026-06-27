import type { EncounterRepository } from "../../domain/repositories/EncounterRepository";
import {
  ConversationRole,
  Prisma,
  PrismaClient,
  ReviewItemType,
} from "@/lib/db/prisma";
import type { Encounter } from "../../domain/entities/Encounter";
import { PrismaEncounterMapper } from "../mappers";
import {
  DeleteEncounterResult,
  EncounterCardResult,
} from "../../application/dto";
import { encounterCardArgs } from "../queries";
import type {
  EncounterReviewDraft,
  SaveEncounterProgressInput,
} from "../../domain/repositories/EncounterRepository";
import type { ConversationTurn } from "../../domain/value-objects";
import { UpdateEncounterValuesInput } from "../../application/dto/UpdateEncounterValuesInput";
import type { DeleteEncounterByIdInput } from "../../application/dto/DeleteEncounterByIdInput";
import type { ReplayEncounterInput } from "../../application/dto/ReplayEncounterInput";

export class PrismaEncounterRepository implements EncounterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(encounter: Encounter): Promise<EncounterCardResult> {
    const status =
      encounter.status === "completed"
        ? "COMPLETED"
        : encounter.status === "abandoned"
          ? "ABANDONED"
          : "IN_PROGRESS";

    const variableValues = encounter.variableValues
      ? (encounter.variableValues as Prisma.InputJsonValue)
      : undefined;

    const record = await this.prisma.encounter.create({
      ...encounterCardArgs,
      data: {
        id: encounter.id,
        userId: encounter.userId,
        scenarioId: encounter.scenarioId,
        status,
        actorId: encounter.actorId,
        variableValues,
      },
    });

    return PrismaEncounterMapper.toCard(record);
  }

  async saveProgress(
    input: SaveEncounterProgressInput,
  ): Promise<EncounterCardResult> {
    const record = await this.prisma.$transaction(async (tx) => {
      const encounter = await tx.encounter.findFirst({
        where: {
          id: input.encounterId,
          userId: input.userId,
          status: "IN_PROGRESS",
        },
        select: { id: true },
      });

      if (!encounter) {
        throw new Error("Encounter not found or not in progress");
      }

      await this.replaceTurns(tx, input.encounterId, input.turns);

      return tx.encounter.update({
        where: { id: input.encounterId },
        ...encounterCardArgs,
        data: {
          conversationPhase: input.conversationPhase,
        },
      });
    });

    return PrismaEncounterMapper.toCard(record);
  }

  async replay(input: ReplayEncounterInput): Promise<EncounterCardResult> {
    const record = await this.prisma.$transaction(async (tx) => {
      const encounter = await tx.encounter.findFirst({
        where: {
          id: input.encounterId,
          userId: input.userId,
        },
        select: { id: true },
      });

      if (!encounter) {
        throw new Error("Encounter not found");
      }

      await tx.encounterReview.deleteMany({
        where: { encounterId: input.encounterId },
      });
      await tx.helperUse.deleteMany({
        where: { encounterId: input.encounterId },
      });
      await tx.conversationTurn.deleteMany({
        where: { encounterId: input.encounterId },
      });

      return tx.encounter.update({
        where: { id: input.encounterId },
        ...encounterCardArgs,
        data: {
          status: "IN_PROGRESS",
          conversationPhase: null,
          completedAt: null,
          abandonedAt: null,
          startedAt: new Date(),
        },
      });
    });

    return PrismaEncounterMapper.toCard(record);
  }

  async completeWithReview(input: {
    encounter: Encounter;
    review: EncounterReviewDraft;
  }): Promise<EncounterCardResult> {
    const { encounter, review } = input;
    const completedAt = encounter.completedAt
      ? new Date(encounter.completedAt)
      : new Date();

    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.encounter.findFirst({
        where: {
          id: encounter.id,
          userId: encounter.userId,
        },
        select: { id: true },
      });

      if (!existing) {
        throw new Error("Encounter not found");
      }

      await this.replaceTurns(tx, encounter.id, encounter.turns ?? []);

      await tx.encounter.update({
        where: { id: encounter.id },
        data: {
          status: "COMPLETED",
          completedAt,
          actorId: encounter.actorId,
          variableValues: encounter.variableValues
            ? (encounter.variableValues as Prisma.InputJsonValue)
            : undefined,
        },
      });

      await tx.encounterReview.deleteMany({
        where: { encounterId: encounter.id },
      });

      await tx.encounterReview.create({
        data: {
          encounterId: encounter.id,
          summary: review.summary,
          retryMoment: review.retryMoment
            ? (review.retryMoment as Prisma.InputJsonValue)
            : undefined,
          skillScores: review.skillScores as Prisma.InputJsonValue,
          unlockedBadgeIds: review.unlockedBadgeIds ?? [],
          items: {
            create: review.items.map((item) => ({
              type: ReviewItemType.GROWTH_AREA,
              criterion: item.criterion,
              title: item.title,
              description: item.description,
              suggestion: item.suggestion,
              evidenceId: item.evidenceTurnId,
              confidence: item.confidence ?? null,
              xpEarned: item.score ?? 10,
            })),
          },
        },
      });

      return tx.encounter.findUniqueOrThrow({
        where: { id: encounter.id },
        ...encounterCardArgs,
      });
    });

    return PrismaEncounterMapper.toCard(record);
  }

  private async replaceTurns(
    tx: Prisma.TransactionClient,
    encounterId: string,
    turns: ConversationTurn[],
  ) {
    await tx.conversationTurn.deleteMany({
      where: { encounterId },
    });

    if (turns.length === 0) return;

    await tx.conversationTurn.createMany({
      data: turns.map((turn) => ({
        id: turn.id,
        encounterId,
        content: turn.content,
        role: (turn.role === "user" ? "USER" : "ACTOR") as ConversationRole,
        speakerId: turn.speakerId ?? null,
        speakerName: turn.speakerName ?? null,
        phase: turn.phase ?? null,
        createdAt: new Date(turn.createdAt),
      })),
    });
  }
  async updateEncounterValues(
    input: UpdateEncounterValuesInput,
  ): Promise<void> {
    await this.prisma.encounter.update({
      where: { id: input.encounterId },
      data: { variableValues: input.variableValues },
    });
  }

  async deleteById(
    input: DeleteEncounterByIdInput,
  ): Promise<DeleteEncounterResult> {
    const encounter = await this.prisma.encounter.delete({
      where: {
        id: input.encounterId,
        userId: input.userId,
      },
      select: {
        id: true,
        scenario: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });
    return {
      encounterId: encounter.id,
      scenarioId: encounter.scenario.id,
    };
  }
}
