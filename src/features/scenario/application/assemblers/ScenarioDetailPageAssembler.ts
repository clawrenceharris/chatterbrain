import { ScenarioLike, ScenarioSave } from "../../domain/value-objects";
import type {
  ScenarioDetailResult,
  ScenarioDetailActor,
  ScenarioDetailPageOutput,
} from "../dto";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_DESCRIPTIONS,
  SOCIAL_SKILL_LABELS,
  DIFFICULTY_ICONS,
  DIFFICULTY_CLASSNAMES,
} from "@/lib/constants";

export type ScenarioDetailPageActor = {
  id: string;
  firstName: string;
  lastName: string;
  description: string | null;
  avatarUrl: string | null;
};

function buildActor(
  scenario: ScenarioDetailResult,
  actor: ScenarioDetailPageActor | null,
): ScenarioDetailActor | null {
  if (!actor) return null;

  const role =
    scenario.actorRole ??
    scenario.actorRelationshipType ??
    "Conversation partner";

  const description =
    actor.description?.trim() ||
    "A friendly conversation partner for this scenario.";

  return {
    id: actor.id,
    name: actor.firstName,
    role,
    description,

    avatarUrl: actor.avatarUrl,
    openingMessage:
      scenario.openingMessage ?? "Hello, how are you doing today?",
  };
}
function getPlayButtonLabel(scenario: ScenarioDetailResult): string {
  if (scenario.encounters.length > 0) {
    return "Start a New Encounter";
  }
  return "Start Encounter";
}

function getRelativeTimeLabel(date: string | null | undefined): string {
  if (!date) return "Not yet";

  const elapsedMs = Date.now() - new Date(date).getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / 86_400_000));

  if (elapsedDays === 0) return "Today";
  if (elapsedDays === 1) return "1 day ago";
  return `${elapsedDays} days ago`;
}

function getStrongestSkillLabel(scenario: ScenarioDetailResult): string {
  const totals = new Map<string, number>();

  for (const encounter of scenario.encounters) {
    for (const [skill, score] of Object.entries(
      encounter.reviewSkillScores ?? {},
    )) {
      totals.set(skill, (totals.get(skill) ?? 0) + Number(score));
    }
  }

  const [strongest] = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  if (!strongest) return "N/A";

  return (
    SOCIAL_SKILL_LABELS[strongest[0] as keyof typeof SOCIAL_SKILL_LABELS] ??
    strongest[0]
  );
}

function getNextSuggestedFocusLabel(scenario: ScenarioDetailResult): string {
  const scores = new Map<string, number>();

  for (const encounter of scenario.encounters) {
    for (const [skill, score] of Object.entries(
      encounter.reviewSkillScores ?? {},
    )) {
      const current = scores.get(skill);
      const numericScore = Number(score);
      scores.set(
        skill,
        current === undefined ? numericScore : Math.min(current, numericScore),
      );
    }
  }

  const [lowest] = [...scores.entries()].sort((a, b) => a[1] - b[1]);
  if (lowest) {
    return (
      SOCIAL_SKILL_LABELS[lowest[0] as keyof typeof SOCIAL_SKILL_LABELS] ??
      lowest[0]
    );
  }

  return scenario.focusSkills[0]
    ? SOCIAL_SKILL_LABELS[scenario.focusSkills[0]]
    : "Follow-up questions";
}

export class ScenarioDetailPageAssembler {
  static toPageOutput(
    scenario: ScenarioDetailResult,
    likes: ScenarioLike[],
    saves: ScenarioSave[],
    actor: ScenarioDetailPageActor | null,
  ): ScenarioDetailPageOutput {
    const completedEncounters = scenario.encounters.filter(
      (encounter) => encounter.status.value === "completed",
    );
    const mostRecentEncounter = scenario.encounters[0] ?? null;
    const resumeEncounter =
      scenario.encounters.find(
        (encounter) => encounter.status.value === "active",
      ) ?? null;
    const lastReviewEncounter = completedEncounters[0] ?? null;

    return {
      sampleConversation: scenario.sampleConversation,
      likes,
      saves,
      contentWarnings: scenario.contentWarnings,
      difficulty: {
        label: DIFFICULTY_LABELS[scenario.difficulty],
        description: DIFFICULTY_DESCRIPTIONS[scenario.difficulty],
        className: DIFFICULTY_CLASSNAMES[scenario.difficulty],
        icon: DIFFICULTY_ICONS[scenario.difficulty],
        value: scenario.difficulty,
      },
      id: scenario.id,
      slug: scenario.slug,
      successCriteria: scenario.successCriteria,
      encounters: scenario.encounters,
      primaryDomain: scenario.primaryDomain,
      secondaryDomain: scenario.secondaryDomain,
      imageUrl: scenario.imageUrl,
      playButtonLabel: getPlayButtonLabel(scenario),
      title: scenario.title,
      defaultActorId: scenario.defaultActorId,
      mostRecentEncounter,
      resumeEncounter,
      lastReviewEncounter,
      totalUserPlayCount: new Set(
        scenario.encounters.map((encounter) => encounter.userId),
      ).size,
      hasEncounter: scenario.encounters.length > 0,
      historySummary: {
        lastPlayedLabel: getRelativeTimeLabel(mostRecentEncounter?.createdAt),
        completedCountLabel: `${completedEncounters.length} ${
          completedEncounters.length === 1 ? "time" : "times"
        }`,
        strongestSkillLabel: getStrongestSkillLabel(scenario),
        nextSuggestedFocusLabel: getNextSuggestedFocusLabel(scenario),
      },
      description: scenario.description,
      setting: scenario.setting,
      goal: scenario.userGoal,
      focusSkills: scenario.focusSkills.map(
        (skill) => SOCIAL_SKILL_LABELS[skill],
      ),
      actor: buildActor(scenario, actor),
    };
  }
}
