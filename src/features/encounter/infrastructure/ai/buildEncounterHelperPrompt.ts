import { getChitterIdentityBlock } from "@/features/ai/persona";
import type { InvokeEncounterHelperInput } from "../../application/dto/InvokeEncounterHelperDto";

function formatTranscript(
  history: InvokeEncounterHelperInput["conversationHistory"],
) {
  if (history.length === 0) return "No conversation yet.";

  return history
    .map((message) => {
      const speaker =
        message.speakerName ?? (message.role === "actor" ? "Actor" : "User");
      return `${speaker}: ${message.content}`;
    })
    .join("\n");
}

function helperTask(helperId: InvokeEncounterHelperInput["helperId"]) {
  switch (helperId) {
    case "vibe-check":
      return `Analyze the user's draft response for tone, clarity, and how it may land with ${"the actor"}. Give one short paragraph of coaching.`;
    case "rephraser":
      return "Rewrite the user's draft so it is clearer, warmer, and easier to say out loud. Return one primary rewrite plus up to two alternate rewrites.";
    case "response-builder":
      return "Suggest 2-3 short responses the user could send next. Each should fit the conversation, sound natural, and be easy to say.";
    case "tone-analyzer":
      return "Analyze the selected message's tone and how it may land. Mention what feeling or intent comes through.";
    case "cue-detector":
      return "Point out one useful social cue in the selected message. Explain what the other person may be signaling or feeling.";
    default:
      return "Help the user practice this conversation.";
  }
}

function responseFormat(helperId: InvokeEncounterHelperInput["helperId"]) {
  if (helperId === "response-builder") {
    return `{
  "text": "One sentence explaining what you noticed or why these responses may work",
  "suggestions": ["response option 1", "response option 2"]
}`;
  }

  if (helperId === "rephraser") {
    return `{
  "text": "One short coaching note about the rewrite",
  "rewrittenDraft": "Best rewrite of the user's draft",
  "suggestions": ["alternate rewrite 1", "alternate rewrite 2"]
}`;
  }

  return `{
  "text": "Your coaching response"
}`;
}

export function buildEncounterHelperPrompt(
  input: InvokeEncounterHelperInput,
): string {
  const transcript = formatTranscript(input.conversationHistory);
  const focus = input.scenario.focusSkills.join(", ") || "conversation skills";
  const traits = input.actor.personalityTraits.join(", ") || "not specified";
  const style = input.actor.communicationStyle || "not specified";
  const target = input.targetMessage
    ? `${input.targetMessage.speakerName ?? input.targetMessage.role}: ${input.targetMessage.content}`
    : "None";

  return `${getChitterIdentityBlock()}

You are helping a user practice a social scenario inside Chatterbrain.
Stay in coach mode. Do not roleplay as the actor.

Scenario:
- Title: ${input.scenario.title}
- Setting: ${input.scenario.setting}
- Actor role: ${input.scenario.actorRole}
- Actor name: ${input.actor.displayName}
- Actor traits: ${traits}
- Actor communication style: ${style}
- Actor description: ${input.actor.description}
- Practice focus: ${focus}

Conversation so far:
${transcript}

User draft:
${input.draftInput?.trim() || "None"}

Selected message:
${target}

Task:
${helperTask(input.helperId)}

Return JSON only in this shape:
${responseFormat(input.helperId)}`;
}
