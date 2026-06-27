import { buildEncounterTemplateValues } from "@/features/encounter/domain/session/encounter-template";
import { renderTemplate } from "@/shared/utils/renderTemplate";
import type { EncounterMachineContext } from "../../domain/types/encounter-machine-context";
import { Difficulty } from "@/types";

type BuildEncounterActorPromptInput = {
  context: EncounterMachineContext;
  actorMessageCount: number;
  phaseGuidance: string;
};

function normalizeDifficulty(difficulty: string): Difficulty | null {
  const normalized = difficulty.trim().toUpperCase();

  if (normalized in Difficulty) {
    return normalized as Difficulty;
  }

  const byLabel: Record<string, Difficulty> = {
    GENTLE: Difficulty.GENTLE,
    REALISTIC: Difficulty.REALISTIC,
    CHALLENGING: Difficulty.CHALLENGE,
    CHALLENGE: Difficulty.CHALLENGE,
    DIFFICULT: Difficulty.DIFFICULT,
  };

  return byLabel[normalized] ?? null;
}

export function getDifficultyBehaviorGuidance(difficulty: string): string {
  switch (normalizeDifficulty(difficulty)) {
    case Difficulty.GENTLE:
      return `Gentle difficulty:
- Be warm, calm, and patient overall.
- When the user is unclear, gently ask them to repeat or clarify.
- You may offer a careful guess only when you are fairly confident ("Did you mean...?").
- Even when being forgiving, never pretend garbled or nonsensical input made sense.`;

    case Difficulty.REALISTIC:
      return `Realistic difficulty:
- Respond the way a real person would in this setting and relationship.
- If you would not understand someone in real life, say so naturally — confusion, "Sorry, what?", or asking them to rephrase.
- Do not smooth over nonsense, off-topic remarks, or broken speech-to-text.
- Stay in character; do not become a helpful coach.`;

    case Difficulty.CHALLENGE:
      return `Challenging difficulty:
- Be harder to talk to than usual while staying believable.
- Show less patience when the user is unclear, tangential, or hard to follow.
- Push back on nonsense instead of accommodating it.
- Mild frustration or distraction is appropriate when their message does not land.`;

    case Difficulty.DIFFICULT:
      return `Difficult difficulty:
- Be genuinely difficult to talk to: impatient, dismissive, guarded, or easily annoyed as fits the character.
- Do not help the user recover from a bad or nonsensical line.
- React authentically to confusion with annoyance, disengagement, or boundary-setting.
- Never improvise meaning to keep the conversation comfortable.`;

    default:
      return `Default difficulty:
- Stay realistic and in character.
- If the user's message does not make sense, react with natural confusion instead of inventing meaning.`;
  }
}

export function buildEncounterActorPrompt({
  context,
  actorMessageCount,
  phaseGuidance,
}: BuildEncounterActorPromptInput): string {
  const {
    currentPhase,
    encounter: { actor, scenario },
    userProfile,
  } = context;
  const templateValues = buildEncounterTemplateValues(
    context.encounter,
    userProfile,
  );
  const renderScenarioTemplate = (template: string): string =>
    renderTemplate(template, templateValues);

  const traits = actor.personalityTraits.join(", ") || "not specified";
  const communicationStyle = actor.communicationStyle || "natural";
  const relationship = scenario.actorRelationshipType || "acquaintance";
  const difficultyGuidance = getDifficultyBehaviorGuidance(scenario.difficulty);

  return `You are roleplaying a social practice encounter. Stay fully in character as the actor.

CHARACTER
- Name: ${actor.displayName}
- Role in scenario: ${scenario.actorRole}
- Relationship to user: ${relationship}
- Personality traits: ${traits}
- Communication style: ${communicationStyle}
- Character notes: ${actor.description || "None"}

SCENARIO
- Title: ${scenario.title}
- Setting: ${renderScenarioTemplate(scenario.setting)}
- Difficulty: ${scenario.difficulty}
- Current phase: ${currentPhase}
- Actor messages so far: ${actorMessageCount}

PHASE GUIDANCE
${phaseGuidance}

UNDERSTANDING THE USER (CRITICAL — every difficulty level)
- Read the user's latest message literally. React only to what they actually said, not what you assume they meant.
- If their message is unclear, grammatically broken, off-topic, incomplete, or does not logically follow the conversation, do NOT invent meaning or improvise as if you understood.
- Garbled speech-to-text is common. Real people ask for clarification, look confused, or say they did not catch that — they do not smoothly continue.
- Never fill in gaps, pretend a nonsensical line was coherent, or advance the topic as if a confusing message landed.

DIFFICULTY BEHAVIOR
${difficultyGuidance}

INSTRUCTIONS
1. Respond only as ${actor.displayName}. Never break character or mention being an AI.
2. Match the personality traits and communication style consistently.
3. Keep replies natural, conversational, and short (2-3 sentences).
4. React to the user's actual words. Do not repeat the opening line.
5. Provide 3 short example replies the user could say next.
6. Choose nextPhase when the conversation naturally moves forward. If it is too early to tell, return the current phase.

RESPONSE FORMAT (JSON only):
{
  "content": "Your in-character reply",
  "userResponseOptions": ["response1", "response2", "response3"],
  "nextPhase": "introduction|main_topic|wrap_up"
}`;
}

export function buildEncounterAnalysisPrompt(
  userInput: string,
  context: EncounterMachineContext,
): string {
  const {
    encounter: { scenario },
    currentPhase,
    currentActorResponse,
    currentUserInput,
  } = context;

  return `Analyze this user response in a social interaction context.

USER RESPONSE: "${userInput}"

CONTEXT:
- Topic: ${scenario.title}
- Setting: ${scenario.setting}
- Difficulty: ${scenario.difficulty}
- Current Phase: ${currentPhase}
- Dialogue: User responded "${currentUserInput}" to "${currentActorResponse?.content}"

SCORING RULES:
- Score based on what the user actually said, not what they might have intended.
- If the response is nonsensical, garbled, off-topic, or does not fit the conversation, score clarity and social awareness very low.
- Do not give high scores for improvised meaning. Broken speech-to-text that does not land should be called out in feedback.
- Difficulty ${scenario.difficulty}: be fair, but do not reward messages that would confuse a real conversation partner.

SCORING CRITERIA: ${scenario.focusSkills.join(", ")}
SCORE EACH SKILL FROM 0-10.

RESPONSE FORMAT (JSON):
{
  "clarity": 7,
  "empathy": 6,
  "assertiveness": 5,
  "socialAwareness": 6,
  "betterResponse": "...",
  "feedback": "..."
}`;
}
