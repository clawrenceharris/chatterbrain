import type { HelperId } from "../../domain/types";

export type EncounterHelperMessage = {
  role: "user" | "actor";
  content: string;
  speakerName?: string;
};

export type InvokeEncounterHelperInput = {
  helperId: HelperId;
  userId: string;
  draftInput?: string;
  targetMessage?: EncounterHelperMessage;
  conversationHistory: EncounterHelperMessage[];
  scenario: {
    title: string;
    setting: string;
    actorRole: string;
    focusSkills: string[];
  };
  actor: {
    displayName: string;
    personalityTraits: string[];
    communicationStyle: string | null;
    description: string;
  };
  mockMode?: boolean;
};

export type InvokeEncounterHelperActionInput = Omit<
  InvokeEncounterHelperInput,
  "userId"
>;

export type InvokeEncounterHelperOutput = {
  text: string;
  suggestions?: string[];
  rewrittenDraft?: string;
};
