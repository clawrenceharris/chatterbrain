"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOpenAI } from "@/features/ai/hooks";
import { saveEncounterProgress } from "@/actions/encounter";
import { OpenAIDialogueAdapter } from "@/features/encounter/infrastructure/ai/OpenAIDialogueAdapter";
import { isEncounterDialogueMockMode } from "@/features/encounter/domain/session/encounter-phase-config";
import { mockActorResponseDelay } from "@/features/encounter/infrastructure/ai/mockDialogueDelay";
import type { ActorResponse } from "@/features/encounter/domain/value-objects/ActorResponse";
import type { ConversationPhase } from "@/features/encounter/domain/value-objects/ConversationPhase";
import type { ConversationMessageProps } from "@/features/encounter/domain/entities/ConversationMessage";
import type { EncounterMachineContext } from "@/features/encounter/domain/types/encounter-machine-context";
import { getEncounterOpeningMessage } from "@/features/encounter/domain/session/encounter-template";
import {
  buildMachineContext,
  buildTurnsFromHistory,
  deriveSessionFromEncounter,
  resolveNextPhase,
  type EncounterSessionState,
} from "@/features/encounter/domain/session/encounter-session";
import { canCompleteEncounter } from "@/features/encounter/domain/session/encounter-phase";
import type { ProfileDetailResult } from "@/features/profile/application/dto";
import type { EncounterPageOutput } from "../../application/dto";
import { useDialogueCompletion } from "./use-encounter-completion";

type UseEncounterSessionOptions = {
  encounter: EncounterPageOutput;
  userProfile: ProfileDetailResult;
};

export type UseEncounterSessionReturn = {
  startDialogue: () => Promise<void>;
  submitUserInput: (input: string) => Promise<void>;
  endDialogue: () => void;
  isLoading: boolean;
  isWaitingForUser: boolean;
  isCompleted: boolean;
  hasError: boolean;
  currentActorResponse?: ActorResponse;
  conversationHistory: ConversationMessageProps[];
  currentPhase: ConversationPhase;
  isSaving: boolean;
  spokenActorMessageId?: string;
  context: EncounterMachineContext;
};

export function useEncounterSession({
  encounter,
  userProfile,
}: UseEncounterSessionOptions): UseEncounterSessionReturn {
  const { addDialogueProgress, isLoading: isSaving } = useDialogueCompletion();
  const openai = useOpenAI();
  const dialogueAdapter = useMemo(
    () => new OpenAIDialogueAdapter(openai),
    [openai],
  );

  const [session, setSession] = useState<EncounterSessionState>(() =>
    deriveSessionFromEncounter(encounter),
  );
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const lastSavedTranscriptRef = useRef("");
  const encounterIdRef = useRef<string | null>(null);
  const hasContinuedPendingResponseRef = useRef(false);

  useEffect(() => {
    if (encounterIdRef.current === encounter.id) return;

    encounterIdRef.current = encounter.id;
    hasContinuedPendingResponseRef.current = false;
    lastSavedTranscriptRef.current = "";
    const nextSession = deriveSessionFromEncounter(encounter);
    setSession(nextSession);
    dialogueAdapter.hydrateFromHistory(nextSession.history);
  }, [dialogueAdapter, encounter, encounter.id]);

  useEffect(() => {
    dialogueAdapter.hydrateFromHistory(session.history);
  }, [dialogueAdapter, encounter.id, session.history]);

  const persistSession = useCallback(
    async (nextSession: EncounterSessionState) => {
      if (nextSession.history.length === 0) return;

      const turns = buildTurnsFromHistory(
        encounter.id,
        nextSession.history,
        userProfile,
        encounter.actor,
      );
      const transcriptKey = JSON.stringify(
        turns.map(({ id, content, role, phase }) => ({
          id,
          content,
          role,
          phase,
        })),
      );

      if (transcriptKey === lastSavedTranscriptRef.current) return;

      lastSavedTranscriptRef.current = transcriptKey;
      await saveEncounterProgress({
        encounterId: encounter.id,
        turns,
        conversationPhase:
          nextSession.phase === "completed" ? "wrap_up" : nextSession.phase,
      });
    },
    [encounter.actor, encounter.id, userProfile],
  );

  const persistSessionRef = useRef(persistSession);

  useEffect(() => {
    persistSessionRef.current = persistSession;
  }, [persistSession]);

  useEffect(() => {
    return () => {
      void persistSessionRef.current(sessionRef.current);
    };
  }, [encounter.id]);

  const completeEncounter = useCallback(
    async (nextSession: EncounterSessionState) => {
      const completedSession: EncounterSessionState = {
        ...nextSession,
        status: "completed",
        phase: "completed",
      };
      setSession(completedSession);
      await persistSession(completedSession);
      await addDialogueProgress(
        buildMachineContext(completedSession, encounter, userProfile),
      );
    },
    [addDialogueProgress, encounter, persistSession, userProfile],
  );

  const appendActorMessage = useCallback(
    async (
      baseSession: EncounterSessionState,
      actorResponse: ActorResponse,
      phase: ConversationPhase,
    ): Promise<EncounterSessionState> => {
      const actorMessage: ConversationMessageProps = {
        id: crypto.randomUUID(),
        speaker: "actor",
        content: actorResponse.content,
        phase,
      };

      const nextSession: EncounterSessionState = {
        ...baseSession,
        status: "awaiting_user",
        phase,
        history: [...baseSession.history, actorMessage],
        currentActorResponse: actorResponse,
        currentUserInput: undefined,
        currentUserAnalysis: undefined,
        spokenActorMessageId: actorMessage.id,
        error: undefined,
      };

      setSession(nextSession);
      await persistSession(nextSession);
      return nextSession;
    },
    [persistSession],
  );

  const runAfterUserMessage = useCallback(
    async (baseSession: EncounterSessionState, userInput: string) => {
      const processingSession: EncounterSessionState = {
        ...baseSession,
        status: "processing",
        currentUserInput: userInput,
        error: undefined,
      };
      setSession(processingSession);

      let history = [...processingSession.history];
      const lastIndex = history.length - 1;
      const lastTurn = history[lastIndex];

      if (
        !lastTurn ||
        lastTurn.speaker !== "user" ||
        lastTurn.content !== userInput
      ) {
        history = [
          ...history,
          {
            id: crypto.randomUUID(),
            speaker: "user" as const,
            content: userInput,
            phase: processingSession.phase,
          },
        ];
      }

      let context = buildMachineContext(
        { ...processingSession, history },
        encounter,
        userProfile,
      );

      const analysis = await dialogueAdapter.analyzeUserResponse(
        userInput,
        context,
      );

      history = history.map((turn, index) =>
        index === history.length - 1 && turn.speaker === "user"
          ? { ...turn, analysis }
          : turn,
      );

      context = buildMachineContext(
        {
          ...processingSession,
          history,
          currentUserAnalysis: analysis,
        },
        encounter,
        userProfile,
      );

      const nextPhase = resolveNextPhase(context, dialogueAdapter);

      if (nextPhase === "completed") {
        await completeEncounter({
          ...processingSession,
          history,
          phase: "completed",
          currentUserAnalysis: analysis,
        });
        return;
      }

      const phaseSession: EncounterSessionState = {
        ...processingSession,
        history,
        phase: nextPhase,
        currentUserAnalysis: analysis,
      };

      context = buildMachineContext(phaseSession, encounter, userProfile);
      dialogueAdapter.hydrateFromHistory(phaseSession.history);
      const actorResponse =
        await dialogueAdapter.generateActorResponse(context);

      if (actorResponse.nextPhase === "completed") {
        if (canCompleteEncounter(phaseSession.phase, phaseSession.history)) {
          await completeEncounter({
            ...phaseSession,
            currentActorResponse: actorResponse,
            phase: "completed",
          });
        } else {
          await appendActorMessage(phaseSession, actorResponse, nextPhase);
        }
        return;
      }

      await appendActorMessage(phaseSession, actorResponse, nextPhase);
    },
    [
      appendActorMessage,
      completeEncounter,
      dialogueAdapter,
      encounter,
      userProfile,
    ],
  );

  const startDialogue = useCallback(async () => {
    if (sessionRef.current.status === "processing") return;
    if (sessionRef.current.history.length > 0) return;

    const openingContent = getEncounterOpeningMessage(encounter, userProfile);
    const startingSession: EncounterSessionState = {
      ...sessionRef.current,
      phase: "introduction",
      error: undefined,
    };

    dialogueAdapter.hydrateFromHistory([]);

    if (isEncounterDialogueMockMode()) {
      setSession({ ...startingSession, status: "processing" });
      await mockActorResponseDelay(openingContent.length);
    }

    await appendActorMessage(
      startingSession,
      {
        content: openingContent,
        userResponseOptions: [],
      },
      "introduction",
    );
  }, [appendActorMessage, dialogueAdapter, encounter, userProfile]);

  const submitUserInput = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed || sessionRef.current.status === "processing") return;
      await runAfterUserMessage(sessionRef.current, trimmed);
    },
    [runAfterUserMessage],
  );

  const endDialogue = useCallback(() => {
    void completeEncounter({
      ...sessionRef.current,
      phase: "completed",
    });
  }, [completeEncounter]);

  useEffect(() => {
    if (session.status !== "pending_actor_response") return;
    if (hasContinuedPendingResponseRef.current) return;

    hasContinuedPendingResponseRef.current = true;
    const userInput = session.currentUserInput;
    if (!userInput) return;

    void runAfterUserMessage(session, userInput);
  }, [runAfterUserMessage, session]);

  const context = useMemo(
    () => buildMachineContext(session, encounter, userProfile),
    [encounter, session, userProfile],
  );

  return {
    startDialogue,
    submitUserInput,
    endDialogue,
    isLoading: session.status === "processing",
    isWaitingForUser: session.status === "awaiting_user",
    isCompleted: session.status === "completed",
    hasError: session.status === "error",
    isSaving,
    currentActorResponse: session.currentActorResponse,
    conversationHistory: session.history,
    currentPhase: session.phase,
    spokenActorMessageId: session.spokenActorMessageId,
    context,
  };
}
