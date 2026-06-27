import type { InvokeEncounterHelperActionInput } from "../dto/InvokeEncounterHelperDto";

function normalizeMessage(
  message: InvokeEncounterHelperActionInput["conversationHistory"][number],
) {
  return {
    role: message.role,
    content: message.content.trim(),
    speakerName: message.speakerName?.trim() ?? "",
  };
}

/** Stable key so repeat helper invocations on the same input reuse cached output. */
export function buildEncounterHelperCacheKey(
  input: InvokeEncounterHelperActionInput,
): string {
  return JSON.stringify({
    helperId: input.helperId,
    draft: input.draftInput?.trim() ?? "",
    target: input.targetMessage
      ? {
          role: input.targetMessage.role,
          content: input.targetMessage.content.trim(),
          speakerName: input.targetMessage.speakerName?.trim() ?? "",
        }
      : null,
    history: input.conversationHistory.map(normalizeMessage),
    scenario: {
      title: input.scenario.title,
      setting: input.scenario.setting,
      actorRole: input.scenario.actorRole,
    },
    actor: input.actor.displayName,
  });
}
