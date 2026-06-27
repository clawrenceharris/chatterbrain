import {
  DomainCardRecord,
  DomainDetailRecord,
  DomainPageScenarioRecord,
} from "../queries";
import {
  DomainCardResult,
  DomainDetailResult,
  DomainPageEncounter,
} from "../../application/dto";
import { DomainPageScenario } from "@/features/domain/application/dto";
import { PrismaEncounterMapper } from "@/features/encounter/infrastructure";
import { EncounterCardRecord } from "@/features/encounter/infrastructure/queries";
import {
  SOCIAL_SKILL_LABELS,
  DIFFICULTY_LABELS,
  ENCOUNTER_STATUS_LABELS,
} from "@/lib/constants";

export class PrismaDomainMapper {
  static toDomainPageEncounter(
    record: EncounterCardRecord,
  ): DomainPageEncounter {
    return {
      id: record.id,
      title: record.scenario.title,
      startButtonLabel:
        record.status === "COMPLETED"
          ? "Start New Encounter"
          : "Resume Encounter",
      actor: {
        role: record.scenario.actorRole,
        id: record.actor.id,
        displayName: `${record.actor.firstName} ${record.actor.lastName}`,
        avatarUrl: record.actor.avatarUrl,
      },

      scenario: {
        slug: record.scenario.slug,
        id: record.scenario.id,
        title: record.scenario.title,
      },
      createdAt: record.createdAt.toISOString(),
      status: {
        label: ENCOUNTER_STATUS_LABELS[record.status],
        value: PrismaEncounterMapper.mapStatus(record.status),
      },
    };
  }
  static toDomainPageScenario(
    record: DomainPageScenarioRecord,
  ): DomainPageScenario {
    return {
      id: record.id,
      slug: record.slug,
      title: record.title,
      hasActiveEncounter: record.encounters.some(
        (encounter) => encounter.status === "IN_PROGRESS",
      ),
      description: record.description,
      difficulty: DIFFICULTY_LABELS[record.difficulty],
      focusSkills: record.focusSkills.map(
        (skill) => SOCIAL_SKILL_LABELS[skill],
      ),
      imageUrl: record.imageUrl,
      actor: record.defaultActor
        ? {
            role: record.actorRole,
            id: record.defaultActor.id,
            displayName: record.defaultActor.firstName,
            avatarUrl: record.defaultActor.avatarUrl,
          }
        : null,
      shortDescription: record.shortDescription,
    };
  }
  static toDetail(domain: DomainDetailRecord): DomainDetailResult {
    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      backgroundImageUrl: domain.backgroundImageUrl,
      description: domain.description,
      scenarios: [],
      relatedDomains: domain.relatedDomains.map((domain) =>
        PrismaDomainMapper.toCard(domain),
      ),
      imageUrl: domain.imageUrl,
    };
  }

  static toCard(domain: DomainCardRecord): DomainCardResult {
    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      description: domain.description,
      imageUrl: domain.imageUrl,
    };
  }
}
