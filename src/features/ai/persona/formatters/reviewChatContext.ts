import { formatTranscript } from "./transcript";
import { EncounterReviewChatContext } from "@/features/encounter/application/dto";

export function formatReviewChatContext(context: EncounterReviewChatContext) {
  const insights = Object.entries(context.review?.turnInsights ?? {})
    .map(
      ([turnId, insight]) =>
        `- ${turnId}: ${insight.criterion} ${insight.score}/100. Feedback: ${insight.feedback}${
          insight.betterResponse
            ? ` Better response: ${insight.betterResponse}`
            : ""
        }`,
    )
    .join("\n");

  return `Encounter: ${context.scenario.title}
Setting: ${context.scenario.setting}
User goal: ${context.scenario.userGoal}
Focus skills: ${context.scenario.focusSkills.join(", ")}
Actor: ${context.actor.displayName} (${context.scenario.actorRole}; ${context.scenario.actorRelationshipType})
Actor notes: ${context.actor.description}
Variable values: ${JSON.stringify(context.variableValues)}

Review summary:
${context.review?.summary ?? "No review summary is available."}

Skill scores:
${JSON.stringify(context.review?.skillScores ?? {})}

Retry moment:
${JSON.stringify(context.review?.retryMoment ?? null)}

Turn insights:
${insights || "No turn insights are available."}

Transcript:
${formatTranscript(context.conversationHistory)}`;
}
