import { Difficulty } from "@/types";
import {
  ActorSearchResult,
  UserSearchResult,
  ScenarioSearchResult,
} from "../../application/dto";
import {
  ActorSearchResultRecord,
  PersonSearchResultRecord,
  ScenarioSearchResultRecord,
} from "../queries/search.queries";
import { SearchHistory } from "@/generated/prisma/client";
import { SavedSearchResult } from "../../application/dto/SavedSearchResult";
import { DIFFICULTY_LABELS, SOCIAL_SKILL_LABELS } from "@/lib/constants";

export class PrismaSearchResultMapper {
  static toSavedSearchResult(search: SearchHistory): SavedSearchResult {
    return {
      id: search.id,
      query: search.query,
      createdAt: search.createdAt,
    };
  }
  static toScenarioSearchResult(
    scenario: ScenarioSearchResultRecord,
  ): ScenarioSearchResult {
    return {
      id: scenario.id,
      description: scenario.shortDescription ?? scenario.description,
      title: scenario.title,
      slug: scenario.slug,
      primaryDomain: scenario.primaryDomain,
      imageUrl: scenario.imageUrl,
      focusSkills: scenario.focusSkills.map(
        (skill) => SOCIAL_SKILL_LABELS[skill],
      ),
      difficulty: DIFFICULTY_LABELS[scenario.difficulty as Difficulty],

      hasActiveEncounter: scenario.encounters.some(
        (encounter) => encounter.status === "IN_PROGRESS",
      ),
      actor: scenario.defaultActor
        ? {
            role: scenario.actorRole,
            id: scenario.defaultActor.id,

            displayName: scenario.defaultActor.firstName,
            avatarUrl: scenario.defaultActor.avatarUrl ?? "",
          }
        : null,
    };
  }
  static toPersonSearchResult(
    person: PersonSearchResultRecord,
  ): UserSearchResult {
    return {
      id: person.userId,
      avatarUrl: person.avatarUrl,
      displayName: person.displayName,
      username: person.username,
      encounterCount: person.encounters.length,
    };
  }
  static toActorSearchResult(
    actor: ActorSearchResultRecord,
  ): ActorSearchResult {
    return {
      id: actor.id,
      name: `${actor.firstName} ${actor.lastName}`,
      description: actor.description ?? "",
      avatarUrl: actor.avatarUrl ?? "",
      voiceId: actor.voiceId,
      personalityTraits: actor.personalityTraits,
    };
  }
}
