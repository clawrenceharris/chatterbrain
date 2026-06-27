import type {
  EncounterStatus as PrismaEncounterStatus,
  Encounter as PrismaEncounter,
  ConversationRole as PrismaConversationRole,
} from "@/lib/db/prisma";
import type {
  ConversationRole,
  EncounterStatus,
} from "../../domain/value-objects";
import type { ConversationPhase } from "../../domain/value-objects/ConversationPhase";
import {
  EncounterReviewChatContextRecord,
  EncounterCardRecord,
  EncounterDetailRecord,
  EncounterResultsRecord,
} from "../queries";
import { Difficulty, SocialSkill } from "@/types";
import { EncounterCardResult } from "../../application/dto/EncounterCardResult";
import { JsonValue } from "@prisma/client/runtime/client";
import { PrismaScenarioMapper } from "@/features/scenario/infrastructure/mappers/PrismaScenarioMapper";
import {
  EncounterDetailResult,
  EncounterReviewChatContext,
  EncounterWithResults,
} from "../../application/dto";
import { Encounter } from "../../domain/entities";
import { ENCOUNTER_STATUS_LABELS } from "@/lib/constants/encounter";

export class PrismaEncounterMapper {
  static mapConversationPhase(
    phase: string | null | undefined,
  ): ConversationPhase | null {
    if (
      phase === "introduction" ||
      phase === "main_topic" ||
      phase === "wrap_up" ||
      phase === "completed"
    ) {
      return phase;
    }
    return null;
  }

  static mapConversationRole(role: PrismaConversationRole): ConversationRole {
    if (role === "USER") return "user";
    if (role === "ACTOR") return "actor";
    console.error("Invalid conversation role", role);
    return "user";
  }

  static toWithResults(record: EncounterResultsRecord): EncounterWithResults {
    return {
      id: record.id,
      scenario: {
        id: record.scenario.id,
        slug: record.scenario.slug,
        title: record.scenario.title,
      },
      conversationHistory: record.turns.map((turn) =>
        PrismaEncounterMapper.toConversationTurn(record.id, turn),
      ),
      actor: {
        id: record.actor.id,
        displayName: `${record.actor.firstName} ${record.actor.lastName}`,
        avatarUrl: record.actor.avatarUrl,
      },
      review: record.review
        ? {
            summary: record.review.summary,
            skillScores: record.review.skillScores as Partial<
              Record<SocialSkill, number>
            >,
            retryMoment: record.review.retryMoment,
            unlockedBadgeIds: record.review.unlockedBadgeIds,
            turnInsights: Object.fromEntries(
              record.review.items.map((item) => [
                item.evidenceId,
                {
                  feedback: item.description,
                  betterResponse: item.suggestion,
                  criterion: item.criterion as SocialSkill,
                  score: item.xpEarned,
                },
              ]),
            ),
          }
        : null,
    };
  }

  static toReviewChatContext(
    record: EncounterReviewChatContextRecord,
  ): EncounterReviewChatContext {
    return {
      id: record.id,
      variableValues: PrismaEncounterMapper.parseVariableValues(
        record.variableValues,
      ),
      scenario: {
        id: record.scenario.id,
        slug: record.scenario.slug,
        title: record.scenario.title,
        description: record.scenario.description,
        setting: record.scenario.setting,
        difficulty: record.scenario.difficulty as Difficulty,
        actorRole: record.scenario.actorRole,
        actorRelationshipType: record.scenario.actorRelationshipType,
        focusSkills: record.scenario.focusSkills as SocialSkill[],
        userGoal: record.scenario.userGoal,
        userRole: record.scenario.userRole,
        successCriteria: record.scenario.successCriteria,
        variables: record.scenario.variables,
      },
      actor: {
        id: record.actor.id,
        displayName: `${record.actor.firstName} ${record.actor.lastName}`,
        description: record.actor.description,
        personalityTraits: record.actor.personalityTraits,
        communicationStyle: record.actor.communicationStyle,
      },
      conversationHistory: record.turns.map((turn) =>
        PrismaEncounterMapper.toConversationTurn(record.id, turn),
      ),
      review: record.review
        ? {
            summary: record.review.summary,
            skillScores: record.review.skillScores as Partial<
              Record<SocialSkill, number>
            >,
            retryMoment: record.review.retryMoment,
            turnInsights: Object.fromEntries(
              record.review.items.map((item) => [
                item.evidenceId,
                {
                  feedback: item.description,
                  betterResponse: item.suggestion,
                  criterion: item.criterion as SocialSkill,
                  score: item.xpEarned,
                },
              ]),
            ),
          }
        : null,
    };
  }
  static toDetail(record: EncounterDetailRecord): EncounterDetailResult {
    return {
      ...record,
      status: PrismaEncounterMapper.mapStatus(record.status),
      variableValues: PrismaEncounterMapper.parseVariableValues(
        record.variableValues,
      ),
      title: record.scenario.title,
      createdAt: record.createdAt.toISOString(),
      conversationPhase: PrismaEncounterMapper.mapConversationPhase(
        record.conversationPhase,
      ),
      scenario: {
        ...record.scenario,
        focusSkills: record.scenario.focusSkills as SocialSkill[],
        difficulty: record.scenario.difficulty as Difficulty,
        variables: PrismaScenarioMapper.parseVariables(
          record.scenario.variables,
        ),
      },
      turns: record.turns.map((turn) =>
        PrismaEncounterMapper.toConversationTurn(record.id, turn),
      ),
      conversationHistory: record.turns.map((turn) => ({
        id: turn.id,
        content: turn.content,
        speaker:
          PrismaEncounterMapper.mapConversationRole(turn.role) === "user"
            ? ("user" as const)
            : ("actor" as const),
        phase:
          PrismaEncounterMapper.mapConversationPhase(turn.phase) ??
          "introduction",
      })),
    };
  }
  static mapStatus(status: PrismaEncounterStatus): EncounterStatus {
    if (status === "NOT_STARTED") return "not_started";
    if (status === "COMPLETED") return "completed";
    if (status === "ABANDONED") return "abandoned";
    if (status === "IN_PROGRESS") return "active";
    console.error("Invalid status", status);
    return "not_started";
  }
  static parseVariableValues(
    variableValues: JsonValue | null,
  ): Record<string, string> | null {
    if (!variableValues || typeof variableValues !== "object") return null;
    // Prisma may store JSON as object or array, but we expect an object mapping variable names to values
    if (Array.isArray(variableValues)) return null;
    return { ...variableValues } as Record<string, string>;
  }
  static toCard(record: EncounterCardRecord): EncounterCardResult {
    return {
      id: record.id,
      scenario: {
        id: record.scenario.id,
        title: record.scenario.title,
        slug: record.scenario.slug,
      },
      actor: {
        role: record.scenario.actorRole,
        id: record.actor.id,
        displayName: `${record.actor.firstName} ${record.actor.lastName}`,
        avatarUrl: record.actor.avatarUrl,
      },
      createdAt: record.createdAt.toISOString(),
      status: {
        label: ENCOUNTER_STATUS_LABELS[record.status],
        value: PrismaEncounterMapper.mapStatus(record.status),
      },
      title: record.scenario.title,
    };
  }

  static toDomain(record: PrismaEncounter): Encounter {
    return new Encounter({
      id: record.id,
      scenarioId: record.scenarioId,
      userId: record.userId,
      actorId: record.actorId,
      status: PrismaEncounterMapper.mapStatus(record.status),
      variableValues: PrismaEncounterMapper.parseVariableValues(
        record.variableValues,
      ),
      turns: [],
      summary: {},
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      completedAt: record.completedAt?.toISOString(),
    });
  }

  private static toConversationTurn(
    encounterId: string,
    turn: {
      id: string;
      role: PrismaConversationRole;
      speakerId: string | null;
      speakerName: string | null;
      content: string;
      createdAt: Date;
      phase?: string | null;
    },
  ) {
    return {
      id: turn.id,
      encounterId,
      role: PrismaEncounterMapper.mapConversationRole(turn.role),
      speakerId: turn.speakerId,
      speakerName: turn.speakerName,
      content: turn.content,
      createdAt: turn.createdAt.toISOString(),
      phase:
        PrismaEncounterMapper.mapConversationPhase(turn.phase) ?? undefined,
    };
  }
}
