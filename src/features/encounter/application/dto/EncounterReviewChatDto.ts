import type { Difficulty, SocialSkill } from "@/types";
import type {
  ConversationTurn,
  ScoreSummary,
} from "../../domain/value-objects";
import type { EncounterTurnInsight } from "./EncounterResultsPageDto";

export type EncounterReviewChatRole = "user" | "assistant";

export type EncounterReviewChatMessage = {
  id?: string;
  role: EncounterReviewChatRole;
  content: string;
};

export type AskEncounterReviewQuestionInput = {
  encounterId: string;
  question: string;
  history?: EncounterReviewChatMessage[];
  userId: string;
};

export type AskEncounterReviewQuestionActionInput = Omit<
  AskEncounterReviewQuestionInput,
  "userId"
>;

export type EncounterReviewChatAnswer = {
  answer: string;
  provider: string;
  model: string;
};

export type EncounterReviewChatContext = {
  id: string;
  variableValues: Record<string, string> | null;
  scenario: {
    id: string;
    slug: string;
    title: string;
    description: string;
    setting: string;
    difficulty: Difficulty;
    actorRole: string;
    actorRelationshipType: string;
    focusSkills: SocialSkill[];
    userGoal: string;
    userRole: string | null;
    successCriteria: unknown;
    variables: unknown;
  };
  actor: {
    id: string;
    displayName: string;
    description: string;
    personalityTraits: string[];
    communicationStyle: string | null;
  };
  conversationHistory: ConversationTurn[];
  review: {
    summary: string;
    skillScores: ScoreSummary;
    retryMoment: unknown;
    turnInsights: Record<string, EncounterTurnInsight>;
  } | null;
};
