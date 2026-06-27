import { EncounterStatus } from "@/features/encounter/domain/value-objects";
import { ScenarioPreviewMessage } from "./ScenarioForPreivew";
import { ScenarioPreviewResult } from "./ScenarioPreviewResult";

export type ScenarioPreviewInput = {
  scenario: ScenarioPreviewResult;
};

export type ScenarioPreviewOutput = {
  id: string;
  slug: string;
  title: string;
  description: string;
  setting: string;
  goal: string;
  user: {
    displayName: string;
    avatarUrl: string | null;
  };
  focusSkills: string[];
  actor: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
  mostRecentEncounter: {
    status: EncounterStatus;
  } | null;
  hasEncounter: boolean;
  sampleConversation: ScenarioPreviewMessage[];
};
