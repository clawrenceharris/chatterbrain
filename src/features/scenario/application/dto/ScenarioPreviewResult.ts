import { EncounterStatus } from "@/features/encounter/domain/value-objects";
import { ScenarioPreviewMessage } from "./ScenarioForPreivew";

export type ScenarioPreviewResult = {
  id: string;
  slug: string;
  title: string;
  description: string;
  setting: string;
  goal: string;
  focusSkills: string[];
  difficulty: string;
  actor: {
    id: string;
    displayName: string;
    role: string;
    description: string;
    avatarUrl: string | null;
  } | null;
  mostRecentEncounter: {
    status: EncounterStatus;
  } | null;
  hasEncounter: boolean;
  sampleConversation: ScenarioPreviewMessage[];
};
