import type { UserResponseAnalysis, ActorResponse } from "../value-objects";
import type { EncounterMachineContext } from "../types";

/**
 * Outbound port for AI dialogue (implemented by OpenAIDialogueAdapter).
 * XState invokes these via injected DialogueMachineServices — keep free of React/Next.
 */
export interface DialoguePort {
  generateActorResponse(
    context: EncounterMachineContext,
  ): Promise<ActorResponse>;

  analyzeUserResponse(
    userInput: string,
    context: EncounterMachineContext,
  ): Promise<UserResponseAnalysis>;

  shouldTransitionPhase(context: EncounterMachineContext): Promise<{
    shouldTransition: boolean;
    nextPhase?: EncounterMachineContext["currentPhase"];
  }>;
}
