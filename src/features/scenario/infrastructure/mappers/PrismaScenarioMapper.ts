import {
  ScenarioCardResult,
  ScenarioDetailResult,
  ScenarioPreviewMessage,
  ScenarioPreviewResult,
} from "../../application/dto";
import {
  ScenarioLike,
  ScenarioSave,
  ScenarioVariable,
} from "../../domain/value-objects";
import { JsonValue } from "@prisma/client/runtime/client";
import { Difficulty, SocialSkill } from "@/types";
import {
  ScenarioCardRecord,
  ScenarioDetailRecord,
  ScenarioPreviewRecord,
  ScenarioSaveRecord,
  ScenarioLikeRecord,
} from "../queries";
import { PrismaEncounterMapper } from "@/features/encounter/infrastructure";
import {
  ENCOUNTER_STATUS_LABELS,
  SOCIAL_SKILL_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/constants";

export class PrismaScenarioMapper {
  static parseVariables(value: JsonValue): ScenarioVariable[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((item): item is ScenarioVariable => {
      return (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "label" in item &&
        "type" in item
      );
    });
  }
  static parseSuccessCriteria(value: JsonValue): string[] {
    if (
      Array.isArray(value) &&
      value.every((item) => typeof item === "string")
    ) {
      return value;
    }

    return [];
  }

  static toScenarioSave(record: ScenarioSaveRecord): ScenarioSave {
    return {
      ...record,
      createdAt: record.createdAt.toISOString(),
    };
  }
  static toScenarioLike(record: ScenarioLikeRecord): ScenarioLike {
    return {
      ...record,
      createdAt: record.createdAt.toISOString(),
    };
  }

  static toDetail(record: ScenarioDetailRecord): ScenarioDetailResult {
    return {
      id: record.id,
      scenarioLikeCount: record.scenarioLikes.length,
      actorRole: record.actorRole,
      actorRelationshipType: record.actorRelationshipType,
      defaultActorId: record.defaultActorId,
      slug: record.slug,
      title: record.title,
      primaryDomain: record.primaryDomain,
      secondaryDomain: record.secondaryDomain,
      totalUserLikeCount: record.scenarioLikes.length,
      totalUserSaveCount: record.scenarioSaves.length,
      shortDescription: record.shortDescription,
      imageUrl: record.imageUrl,
      description: record.description,
      difficulty: record.difficulty as Difficulty,
      variables: PrismaScenarioMapper.parseVariables(record.variables),
      focusSkills: record.focusSkills as SocialSkill[],

      setting: record.setting,
      completed: record.encounters.some(
        (encounter) => encounter.status === "COMPLETED",
      ),
      hasActiveEncounter: record.encounters.some(
        (encounter) => encounter.status === "IN_PROGRESS",
      ),
      sampleConversation: PrismaScenarioMapper.parseSampleConversation(
        record.sampleConversation,
      ),
      userRole: record.userRole,
      userGoal: record.userGoal,
      openingMessage: record.openingMessage,
      successCriteria: PrismaScenarioMapper.parseSuccessCriteria(
        record.successCriteria,
      ),
      supportNote: record.supportNote,
      contentWarnings: record.contentWarnings,
      xpReward: record.xpReward,
      encounters: record.encounters.map((encounter) => ({
        id: encounter.id,
        title: record.title,
        userId: encounter.userId,
        scenarioId: record.id,
        createdAt: encounter.createdAt.toISOString(),
        completedAt: encounter.completedAt?.toISOString() ?? null,
        completed: encounter.status === "COMPLETED",
        status: {
          label: ENCOUNTER_STATUS_LABELS[encounter.status],
          value: PrismaEncounterMapper.mapStatus(encounter.status),
        },
        variableValues: PrismaEncounterMapper.parseVariableValues(
          encounter.variableValues,
        ),
        reviewSkillScores: encounter.review?.skillScores
          ? (encounter.review.skillScores as Record<string, number>)
          : null,
        actor: encounter.actor
          ? {
              id: encounter.actor.id,
              displayName: encounter.actor.firstName,
              avatarUrl: encounter.actor.avatarUrl,
            }
          : null,
      })),
    };
  }
  static toCard(record: ScenarioCardRecord): ScenarioCardResult {
    return {
      id: record.id,
      slug: record.slug,
      title: record.title,
      imageUrl: record.imageUrl,
      hasActiveEncounter: record.encounters.some(
        (encounter) => encounter.status === "IN_PROGRESS",
      ),
      description: record.shortDescription ?? record.description,
      difficulty: DIFFICULTY_LABELS[record.difficulty],
      focusSkills: record.focusSkills.map(
        (skill) => SOCIAL_SKILL_LABELS[skill],
      ),
      actor: record.defaultActor
        ? {
            role: record.actorRole,
            id: record.defaultActor.id,
            displayName: record.defaultActor.firstName,
            avatarUrl: record.defaultActor.avatarUrl,
          }
        : null,
    };
  }
  static parseSampleConversation(value: JsonValue): ScenarioPreviewMessage[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((item): item is ScenarioPreviewMessage => {
      return (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "role" in item &&
        "content" in item &&
        "speaker" in item &&
        "speakerName" in item &&
        typeof item.role === "string" &&
        typeof item.content === "string" &&
        typeof item.speaker === "string" &&
        typeof item.speakerName === "string"
      );
    });
  }
  static toPreview(record: ScenarioPreviewRecord): ScenarioPreviewResult {
    return {
      id: record.id,
      slug: record.slug,
      title: record.title,
      description: record.description,
      setting: record.setting,
      goal: record.userGoal,
      mostRecentEncounter: {
        status: PrismaEncounterMapper.mapStatus(
          record.encounters?.[0]?.status ?? "not_started",
        ),
      },
      hasEncounter: record.encounters.length > 0,
      focusSkills: record.focusSkills.map(
        (skill) => SOCIAL_SKILL_LABELS[skill],
      ),
      difficulty: DIFFICULTY_LABELS[record.difficulty],
      actor: record.defaultActor
        ? {
            id: record.defaultActor.id,
            displayName: `${record.defaultActor.firstName} ${record.defaultActor.lastName}`,
            role: record.actorRole,
            description: record.description,
            avatarUrl: record.defaultActor.avatarUrl,
          }
        : null,
      sampleConversation: PrismaScenarioMapper.parseSampleConversation(
        record.sampleConversation,
      ),
    };
  }
}
