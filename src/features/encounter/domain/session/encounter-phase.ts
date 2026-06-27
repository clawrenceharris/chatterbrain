import type { ConversationMessageProps } from "../entities/ConversationMessage";
import type { ConversationPhase } from "../value-objects/ConversationPhase";
import {
  ENCOUNTER_PHASE_LIMITS,
  isEncounterDialogueMockMode,
} from "./encounter-phase-config";

export function countUserTurns(history: ConversationMessageProps[]) {
  return history.filter((turn) => turn.speaker === "user").length;
}

export function countUserTurnsInPhase(
  history: ConversationMessageProps[],
  phase: ConversationPhase,
) {
  return history.filter(
    (turn) => turn.speaker === "user" && turn.phase === phase,
  ).length;
}

export function shouldForceComplete(history: ConversationMessageProps[]) {
  return countUserTurns(history) >= ENCOUNTER_PHASE_LIMITS.maxUserTurns;
}

export function shouldForceWrapUp(
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
) {
  if (currentPhase === "wrap_up" || currentPhase === "completed") {
    return false;
  }

  return (
    countUserTurns(history) >=
    ENCOUNTER_PHASE_LIMITS.maxUserTurnsBeforeForcedWrapUp
  );
}

export function hasMetMinimumTurnsForPhase(
  phase: ConversationPhase,
  history: ConversationMessageProps[],
) {
  switch (phase) {
    case "introduction":
      return (
        countUserTurnsInPhase(history, "introduction") >=
        ENCOUNTER_PHASE_LIMITS.minIntroductionUserTurns
      );
    case "main_topic":
      return (
        countUserTurnsInPhase(history, "main_topic") >=
        ENCOUNTER_PHASE_LIMITS.minMainTopicUserTurns
      );
    case "wrap_up":
      return (
        countUserTurnsInPhase(history, "wrap_up") >=
        ENCOUNTER_PHASE_LIMITS.minWrapUpUserTurns
      );
    default:
      return false;
  }
}

export function canCompleteEncounter(
  phase: ConversationPhase,
  history: ConversationMessageProps[],
): boolean {
  if (phase !== "wrap_up") return false;
  return hasMetMinimumTurnsForPhase("wrap_up", history);
}

export function resolveMockPhaseAfterUserTurn(
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
): ConversationPhase {
  if (
    currentPhase === "introduction" &&
    hasMetMinimumTurnsForPhase("introduction", history)
  ) {
    return "main_topic";
  }

  if (
    currentPhase === "main_topic" &&
    hasMetMinimumTurnsForPhase("main_topic", history)
  ) {
    return "wrap_up";
  }

  return currentPhase;
}

export function resolveAIPhaseAfterUserTurn(
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
  actorSuggestedPhase?: ConversationPhase,
): ConversationPhase {
  if (shouldForceWrapUp(currentPhase, history)) {
    return "wrap_up";
  }

  const proposed = clampActorNextPhase(
    actorSuggestedPhase,
    currentPhase,
    history,
  );

  if (proposed && hasMetMinimumTurnsForPhase(currentPhase, history)) {
    return proposed;
  }

  if (
    currentPhase === "introduction" &&
    hasMetMinimumTurnsForPhase("introduction", history)
  ) {
    return "main_topic";
  }

  return currentPhase;
}

/** @deprecated Use resolveNextPhase instead. */
export function resolvePhaseAfterUserTurn(
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
): ConversationPhase {
  if (canCompleteEncounter(currentPhase, history)) {
    return "completed";
  }

  if (isEncounterDialogueMockMode()) {
    return resolveMockPhaseAfterUserTurn(currentPhase, history);
  }

  return resolveAIPhaseAfterUserTurn(currentPhase, history);
}

export function resolveNextPhase(
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
  actorSuggestedPhase?: ConversationPhase,
  options?: { mockMode?: boolean },
): ConversationPhase {
  const mockMode = options?.mockMode ?? isEncounterDialogueMockMode();

  if (shouldForceComplete(history)) {
    return "completed";
  }

  if (canCompleteEncounter(currentPhase, history)) {
    return "completed";
  }

  if (mockMode) {
    return resolveMockPhaseAfterUserTurn(currentPhase, history);
  }

  return resolveAIPhaseAfterUserTurn(
    currentPhase,
    history,
    actorSuggestedPhase,
  );
}

export function clampActorNextPhase(
  proposed: ConversationPhase | undefined,
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
): ConversationPhase | undefined {
  if (!proposed || proposed === currentPhase) {
    return undefined;
  }

  if (proposed === "completed") {
    return canCompleteEncounter(currentPhase, history)
      ? "completed"
      : undefined;
  }

  const order: ConversationPhase[] = [
    "introduction",
    "main_topic",
    "wrap_up",
    "completed",
  ];
  const currentIndex = order.indexOf(currentPhase);
  const proposedIndex = order.indexOf(proposed);

  if (proposedIndex <= currentIndex) {
    return undefined;
  }

  if (proposedIndex - currentIndex > 1) {
    return order[currentIndex + 1];
  }

  return proposed;
}

export function buildEncounterPhaseGuidance(
  currentPhase: ConversationPhase,
  history: ConversationMessageProps[],
): string {
  const totalUserTurns = countUserTurns(history);
  const phaseUserTurns = countUserTurnsInPhase(history, currentPhase);
  const {
    minIntroductionUserTurns,
    minMainTopicUserTurns,
    maxUserTurnsBeforeForcedWrapUp,
    maxUserTurns,
  } = ENCOUNTER_PHASE_LIMITS;

  const minimumsByPhase: Record<ConversationPhase, number> = {
    introduction: minIntroductionUserTurns,
    main_topic: minMainTopicUserTurns,
    wrap_up: ENCOUNTER_PHASE_LIMITS.minWrapUpUserTurns,
    completed: 0,
  };

  const minTurns = minimumsByPhase[currentPhase];
  const lines = [
    `- Current phase: ${currentPhase}`,
    `- User turns in this phase: ${phaseUserTurns} (minimum before advancing: ${minTurns})`,
    `- Total user turns: ${totalUserTurns}`,
    `- Set nextPhase to the current phase when it is too early to move forward.`,
  ];

  if (shouldForceWrapUp(currentPhase, history)) {
    lines.push(
      "- The conversation has run long. Move to wrap_up now and begin closing naturally.",
    );
  } else if (totalUserTurns >= maxUserTurnsBeforeForcedWrapUp - 2) {
    lines.push(
      "- The conversation is getting long. Start steering toward wrap_up soon if it fits.",
    );
  }

  if (totalUserTurns >= maxUserTurns - 1) {
    lines.push(
      "- This should be the final exchange. Use wrap_up and close the conversation.",
    );
  }

  if (
    currentPhase === "introduction" &&
    phaseUserTurns < minIntroductionUserTurns
  ) {
    lines.push("- Stay in introduction until the opening feels complete.");
  }

  if (currentPhase === "main_topic" && phaseUserTurns < minMainTopicUserTurns) {
    lines.push(
      "- Stay in main_topic; the core topic is not ready to wrap yet.",
    );
  }

  if (currentPhase === "wrap_up") {
    lines.push(
      "- You are wrapping up. Keep responses brief and do not open new major topics.",
    );
  }

  return lines.join("\n");
}
