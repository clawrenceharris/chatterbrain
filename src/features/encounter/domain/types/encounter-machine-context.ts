import type { ResponseOutputItem } from "openai/resources/responses/responses.mjs";
import type { ConversationMessageProps } from "../entities";
import type {
  ActorResponse,
  ConversationPhase,
  ScoreSummary,
  UserResponseAnalysis,
} from "../value-objects";
import { ProfileDetailResult } from "@/features/profile/application/dto";
import { EncounterPageOutput } from "../../application/dto";

export interface EncounterMachineContext {
  encounter: EncounterPageOutput;
  userProfile: ProfileDetailResult;
  variableValues: Record<string, string>;
  responses: ResponseOutputItem[];
  conversationHistory: ConversationMessageProps[];
  currentPhase: ConversationPhase;
  currentActorResponse?: ActorResponse;
  currentUserInput?: string;
  currentUserAnalysis?: UserResponseAnalysis;
  totalScores: ScoreSummary;
  error?: string;
}
