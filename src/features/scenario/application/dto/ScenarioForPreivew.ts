import { EncounterStatus } from "@/features/encounter/domain/value-objects";

export type ScenarioForPreivew = {
  id: string;
  slug: string;
  title: string;
  description: string;
  setting: string;
  userGoal: string;
  difficulty: string;
  focusSkills: string[];
  goal: string;
  mostRecentEncounter: {
    id: string;
    title: string;
    createdAt: string;
    status: EncounterStatus;
    actor: {
      id: string;
      displayName: string;
      avatarUrl: string | null;
    } | null;
    variableValues: Record<string, string>;
    completed: boolean;
  };
  hasEncounter: boolean;
  actor: {
    id: string;
    name: string;
    role: string;
    description: string;
    avatarUrl: string | null;
  } | null;
  sampleConversation: ScenarioPreviewMessage[];
};

export type ScenarioPreviewMessage = {
  role: "user" | "actor";
  content: string;
  speaker: string;
  speakerName: string;
};
