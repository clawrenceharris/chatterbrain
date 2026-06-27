import type { EncounterMachineContext } from "@/features/encounter/domain/types";
import type { ConversationTurn } from "@/features/encounter/domain/value-objects";
import { buildChitterSystemPrompt } from "../buildChitterSystemPrompt";
import { formatTranscript } from "../formatters";

export function buildChitterEncounterReviewPrompt(
  context: EncounterMachineContext,
  turns: ConversationTurn[],
) {
  const userTurnIds = turns
    .filter((turn) => turn.role === "user")
    .map((turn) => turn.id)
    .join(", ");

  return buildChitterSystemPrompt({
    surface: "Encounter review generation",
    taskRules: [
      "Return strict JSON only. Do not wrap it in markdown.",
      "Use Chitter's warm, concrete coaching voice inside summary, feedback, and whyItMatters fields.",
      "Include one item in turns for every user turn id listed below.",
      "Keep feedback specific to the transcript and avoid invented details.",
      "Use one SocialSkill enum from the scenario focus skills when possible.",
    ],
    contextBlock: `Scenario:
- Title: ${context.encounter.scenario.title}
- Setting: ${context.encounter.scenario.setting}
- User goal: ${context.encounter.scenario.title}
- Focus skills: ${context.encounter.scenario.focusSkills.join(", ")}

Transcript:
${formatTranscript(turns)}

User turn ids:
${userTurnIds}

JSON schema:
{
  "summary": "2-3 sentence encouraging summary",
  "skillScores": { "CLARITY": 0-100, "EMPATHY": 0-100 },
  "retryMoment": {
    "turnId": "user turn id",
    "originalText": "exact user text",
    "whyItMatters": "why this moment matters",
    "suggestedRewrite": "stronger response"
  },
  "turns": [
    {
      "turnId": "user turn id",
      "criterion": "one SocialSkill enum from the focus skills when possible",
      "feedback": "specific feedback for this user response",
      "betterResponse": "a stronger alternative response",
      "score": 0-100,
      "confidence": 0-1
    }
  ]
}`,
  });
}
