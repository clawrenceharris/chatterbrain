import type { ConversationMessageProps } from "../entities/ConversationMessage";
import type { EncounterPageOutput } from "../../application/dto";
import type { ProfileDetailResult } from "@/features/profile/application/dto";
import type { EncounterMachineContext } from "../types/encounter-machine-context";
import type { ActorResponse } from "../value-objects/ActorResponse";
import type { ConversationPhase } from "../value-objects/ConversationPhase";
import type { ScoreSummary } from "../value-objects/ScoreSummary";
import type { UserResponseAnalysis } from "../value-objects/UserResponseAnalysis";
import type { ConversationTurn } from "../value-objects/ConversationTurn";
import { SocialSkill } from "@/types";
import { resolveNextPhase as resolveEncounterPhase } from "./encounter-phase";

export type EncounterSessionStatus =
  | "needs_start"
  | "awaiting_user"
  | "pending_actor_response"
  | "processing"
  | "completed"
  | "error";

export type EncounterSessionState = {
  status: EncounterSessionStatus;
  history: ConversationMessageProps[];
  phase: ConversationPhase;
  currentActorResponse?: ActorResponse;
  currentUserInput?: string;
  currentUserAnalysis?: UserResponseAnalysis;
  totalScores: ScoreSummary;
  error?: string;
  /** Set when a new actor line is generated so the UI can play audio once. */
  spokenActorMessageId?: string;
};

export function createInitialScores(): ScoreSummary {
  return {
    [SocialSkill.EMPATHY]: 0,
    [SocialSkill.ASSERTIVENESS]: 0,
    [SocialSkill.CLARITY]: 0,
    [SocialSkill.ENGAGEMENT]: 0,
    [SocialSkill.SOCIAL_AWARENESS]: 0,
    [SocialSkill.SETTING_BOUNDARIES]: 0,
    [SocialSkill.REPAIR]: 0,
    [SocialSkill.CUE_RECOGNITION]: 0,
    [SocialSkill.SMALL_TALK]: 0,
    [SocialSkill.CONFLICT_NAVIGATION]: 0,
    [SocialSkill.EMOTIONAL_RECOGNITION]: 0,
    [SocialSkill.RELEVANCE]: 0,
    [SocialSkill.TONE_AWARENESS]: 0,
    [SocialSkill.FOLLOW_UP]: 0,
    [SocialSkill.CONVERSATION_FLOW]: 0,
    [SocialSkill.SOCIAL_TIMING]: 0,
    [SocialSkill.PERSPECTIVE_TAKING]: 0,
  };
}

export function findLastActorTurn(
  history: ConversationMessageProps[],
): ConversationMessageProps | undefined {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index]?.speaker === "actor") {
      return history[index];
    }
  }
  return undefined;
}

export function toActorResponse(
  turn: ConversationMessageProps | undefined,
): ActorResponse | undefined {
  if (!turn) return undefined;

  return {
    content: turn.content,
    userResponseOptions: [],
  };
}

export function deriveSessionFromEncounter(
  encounter: EncounterPageOutput,
): EncounterSessionState {
  const history = [...(encounter.conversationHistory ?? [])];
  const phase =
    encounter.conversationPhase ??
    history[history.length - 1]?.phase ??
    "introduction";
  const totalScores = createInitialScores();

  if (encounter.status.value === "completed") {
    return {
      status: "completed",
      history,
      phase: "completed",
      totalScores,
      currentActorResponse: toActorResponse(findLastActorTurn(history)),
    };
  }

  if (history.length === 0) {
    return {
      status: "needs_start",
      history,
      phase: "introduction",
      totalScores,
    };
  }

  const lastTurn = history[history.length - 1]!;
  const lastActorTurn = findLastActorTurn(history);
  const currentActorResponse = toActorResponse(lastActorTurn);

  if (lastTurn.speaker === "actor") {
    return {
      status: "awaiting_user",
      history,
      phase,
      totalScores,
      currentActorResponse,
    };
  }

  return {
    status: "pending_actor_response",
    history,
    phase,
    totalScores,
    currentActorResponse,
    currentUserInput: lastTurn.content,
    currentUserAnalysis: lastTurn.analysis,
  };
}

export function buildMachineContext(
  session: EncounterSessionState,
  encounter: EncounterPageOutput,
  userProfile: ProfileDetailResult,
): EncounterMachineContext {
  return {
    encounter,
    userProfile,
    variableValues: encounter.variableValues ?? {},
    responses: [],
    conversationHistory: session.history,
    currentPhase: session.phase,
    currentActorResponse: session.currentActorResponse,
    currentUserInput: session.currentUserInput,
    currentUserAnalysis: session.currentUserAnalysis,
    totalScores: session.totalScores,
    error: session.error,
  };
}

export function buildTurnsFromHistory(
  encounterId: string,
  history: ConversationMessageProps[],
  userProfile: ProfileDetailResult,
  actor: EncounterPageOutput["actor"],
): ConversationTurn[] {
  return history.map((turn, index) => ({
    id: turn.id,
    encounterId,
    content: turn.content,
    createdAt: new Date(Date.now() + index).toISOString(),
    role: turn.speaker === "user" ? "user" : "actor",
    speakerId: turn.speaker === "user" ? userProfile.userId : actor.id,
    speakerName:
      turn.speaker === "user"
        ? (userProfile.displayName ?? userProfile.username)
        : actor.displayName,
    phase: turn.phase,
  }));
}

import type { DialoguePort } from "../services/DialoguePort";

export function resolveNextPhase(
  context: EncounterMachineContext,
  _dialoguePort?: Pick<DialoguePort, "shouldTransitionPhase">,
  options?: { mockMode?: boolean },
): ConversationPhase {
  return resolveEncounterPhase(
    context.currentPhase,
    context.conversationHistory,
    context.currentActorResponse?.nextPhase,
    options,
  );
}
