import { getChitterIdentityBlock } from "@/features/ai/persona";
import type { InvokeEncounterHelperInput } from "../../application/dto/InvokeEncounterHelperDto";

const HELPER_SCOPE_RULES = `HELPER SCOPE (strict — overrides any general coaching habits):
- Stay inside this helper's single job. Do not stack analysis, meaning, reasoning, and example replies.
- Never suggest what the user should say unless you are Response Builder.
- Never rephrase the user's words unless you are Rephraser.
- Keep outputs short. No paragraphs. No bullet lists in text fields.`;

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
    case "cue-detector":
      return `Cue Detector — selected message only.
Spot obvious or hidden social cues: feelings, subtext, pressure, openness, discomfort, or intent.
State what may need to be noticed. Do NOT suggest a reply, rephrase, or coaching advice.
Max 2 short sentences.`;

    case "tone-analyzer":
      return `Tone Analyzer — selected message only.
Name the tone using 1-2 tone words (examples: neutral, warm, impatient, guarded, sarcastic, anxious, dismissive, curious).
Optional: one short sentence on why — no reply ideas, no rewrites, no social-cue essay.
Do NOT include example responses.`;

    case "vibe-check":
      return `Vibe Check — user draft only.
Give a light, playful read on the draft's vibe: tone, humor (if any), and whether it matches the conversation's overall vibe.
Keep it fun and brief. No example responses, no rewrites, no skill lecture.
Max 2 short sentences.`;

    case "rephraser":
      return `Rephraser — user draft only.
Return exactly ONE clearer rewrite the user could send. Same intent, easier to say out loud.
No alternates. No coaching note. No explanation.`;

    case "response-builder":
      return `Response Builder — conversation context only.
Suggest 2-3 short replies the user could send next. Natural, easy to say out loud.
No analysis, no coaching text, no reasoning.`;

    default:
      return "Help the user practice this conversation briefly.";
  }
}

function responseFormat(helperId: InvokeEncounterHelperInput["helperId"]) {
  switch (helperId) {
    case "response-builder":
      return `{
  "suggestions": ["response 1", "response 2", "response 3"]
}`;

    case "rephraser":
      return `{
  "rewrittenDraft": "single rewrite only"
}`;

    case "tone-analyzer":
      return `{
  "tone": "impatient",
  "text": "optional one short sentence max"
}`;

    default:
      return `{
  "text": "short helper output only"
}`;
  }
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

${HELPER_SCOPE_RULES}

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
