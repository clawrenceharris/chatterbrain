import { ScenarioVariable } from "@/features/scenario/domain/value-objects";
import { ConversationMessageProps } from "../../domain/entities";
import { ConversationTurn, EncounterStatus } from "../../domain/value-objects";
import type { ConversationPhase } from "../../domain/value-objects/ConversationPhase";

export type EncounterPageActor = {
  id: string;
  displayName: string;
  description: string;
  avatarUrl: string | null;
  voiceId: string;
  personalityTraits: string[];
  communicationStyle: string | null;
};
export type EncounterPageInput = {
  id: string;
  createdAt: string;
  title: string;
  status: EncounterStatus;
  actor: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    voiceId: string;
    description: string;
    personalityTraits: string[];
    communicationStyle: string | null;
  };
  variableValues: Record<string, string> | null;
  scenario: EncounterPageScenario;
  turns: ConversationTurn[];
  conversationHistory: ConversationMessageProps[];
  conversationPhase: ConversationPhase | null;
};
export type EncounterDetailResult = {
  id: string;
  createdAt: string;
  title: string;
  status: EncounterStatus;
  actor: {
    id: string;
    firstName: string;
    lastName: string | null;
    avatarUrl: string | null;
    voiceId: string;
    personalityTraits: string[];
  } | null;
  variableValues: Record<string, string> | null;
  scenario: EncounterPageScenario;
  turns: ConversationTurn[];
  conversationHistory: ConversationMessageProps[];
  conversationPhase: ConversationPhase | null;
};

export type EncounterPageScenario = {
  focusSkills: string[];
  id: string;
  slug: string;
  description: string;
  title: string;
  actorRole: string;
  actorRelationshipType: string;
  difficulty: string;
  openingMessage: string | null;
  variables: ScenarioVariable[];
  setting: string;
};

export type EncounterPageOutput = {
  id: string;
  status: {
    value: EncounterStatus;
    label: string;
  };
  title: string;
  actor: EncounterPageActor;
  variableValues: Record<string, string> | null;
  scenario: EncounterPageScenario;
  conversationHistory: ConversationMessageProps[];
  conversationPhase: ConversationPhase | null;
};

export type GetEncounterPageInput = {
  encounterId: string;
  actorId?: string | null;
  userId: string;
};
