import { ProfileCardResult } from "@/features/profile/application/dto";
import { ScenarioPreviewResult } from "../dto";
import { ScenarioPreviewOutput } from "../dto/ScenarioPreviewDto";

export class ScenarioPreviewAssembler {
  static toPreviewOutput(
    scenario: ScenarioPreviewResult,
    user: ProfileCardResult,
  ): ScenarioPreviewOutput {
    return {
      id: scenario.id,
      slug: scenario.slug,
      title: scenario.title,
      description: scenario.description,
      setting: scenario.setting,
      goal: scenario.goal,
      focusSkills: scenario.focusSkills,
      user: {
        displayName: user.displayName ?? user.username,
        avatarUrl: user.avatarUrl,
      },
      actor: scenario.actor
        ? {
            displayName: scenario.actor.displayName,
            avatarUrl: scenario.actor.avatarUrl,
          }
        : null,
      mostRecentEncounter: scenario.mostRecentEncounter,
      sampleConversation: scenario.sampleConversation,
      hasEncounter: scenario.hasEncounter,
    };
  }
}
