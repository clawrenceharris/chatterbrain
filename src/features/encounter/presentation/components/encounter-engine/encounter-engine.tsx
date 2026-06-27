"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DialogueComposer } from "@/features/encounter/presentation/components";
import { EncounterMessageList } from "../encounter-messages";
import { assets, HELPER_CONFIGS } from "@/lib/constants";
import { useUser } from "@/components/providers";
import type { ChatMessage } from "@/features/encounter/domain/types";
import { EncounterEngineHeader } from ".";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useEncounterContext } from "../../providers";

import { useEncounterSession } from "../../hooks";
import { EncounterPageOutput } from "@/features/encounter/application/dto";
import {
  EncounterHelperProvider,
  useEncounterHelperContext,
} from "../../providers/encounter-helper-provider";
import { RotateCcw } from "lucide-react";
import Image from "next/image";

type EncounterEngineProps = {
  encounter: EncounterPageOutput;
};
export function EncounterEngine({ encounter }: EncounterEngineProps) {
  const [input, setInput] = useState("");

  const {
    toggleListening,
    isListening,
    isProcessingSpeech,
    playAudio,
    handleReplay,
    handleDone,
    handleViewResults,
    toggleAudio,
    handleExit,
    isVolumeOn,
  } = useEncounterContext();
  const { profile } = useUser();
  const { actor, scenario } = encounter;
  const {
    submitUserInput,
    isLoading,
    isCompleted,
    currentActorResponse,
    conversationHistory,
    startDialogue,
    spokenActorMessageId,
  } = useEncounterSession({ encounter, userProfile: profile });

  const composerMessages = useMemo<ChatMessage[]>(
    () =>
      actor
        ? conversationHistory.map((message) => ({
            id: message.id,
            speakerId: message.speaker === "actor" ? actor.id : profile.userId,
            speakerName:
              message.speaker === "actor" ? actor.displayName : "You",
            role: message.speaker,
            content: message.content,
            createdAt: "",
            avatarUrl:
              message.speaker === "actor"
                ? (actor.avatarUrl ?? null)
                : (profile.avatarUrl ?? null),
          }))
        : [],
    [actor, conversationHistory, profile.userId, profile.avatarUrl],
  );

  return (
    <EncounterHelperProvider encounter={encounter} messages={composerMessages}>
      <EncounterEngineView
        actor={actor}
        scenario={scenario}
        composerMessages={composerMessages}
        currentActorResponse={currentActorResponse}
        input={input}
        isCompleted={isCompleted}
        isListening={isListening}
        isLoading={isLoading}
        isProcessingSpeech={isProcessingSpeech}
        onDone={handleDone}
        onExit={handleExit}
        onReplay={handleReplay}
        onSubmitUserInput={submitUserInput}
        onToggleAudio={toggleAudio}
        onToggleListening={toggleListening}
        onViewResults={handleViewResults}
        setInput={setInput}
        spokenActorMessageId={spokenActorMessageId}
        startDialogue={startDialogue}
        conversationHistoryLength={conversationHistory.length}
        playAudio={playAudio}
        isVolumeOn={isVolumeOn}
      />
    </EncounterHelperProvider>
  );
}

type EncounterEngineViewProps = {
  actor: EncounterPageOutput["actor"];
  scenario: EncounterPageOutput["scenario"];
  composerMessages: ChatMessage[];
  conversationHistoryLength: number;
  currentActorResponse?: ReturnType<
    typeof useEncounterSession
  >["currentActorResponse"];
  input: string;
  isCompleted: boolean;
  isListening: boolean;
  isLoading: boolean;
  isProcessingSpeech: boolean;
  onDone: () => void;
  onExit: () => void;
  onReplay: () => void;
  onSubmitUserInput: (input: string) => Promise<void>;
  onToggleAudio: () => void;
  onToggleListening: (onUserInput: (input: string) => void) => void;
  onViewResults: () => void;
  playAudio: (text: string) => void;
  setInput: (value: string) => void;
  spokenActorMessageId?: string;
  startDialogue: () => Promise<void>;
  isVolumeOn: boolean;
};

function EncounterEngineView({
  actor,
  scenario,
  composerMessages,
  conversationHistoryLength,
  currentActorResponse,
  input,
  isCompleted,
  isListening,
  isLoading,
  isProcessingSpeech,
  onDone,
  onExit,
  onReplay,
  onSubmitUserInput,
  onToggleAudio,
  onToggleListening,
  onViewResults,
  playAudio,
  setInput,
  spokenActorMessageId,
  startDialogue,
  isVolumeOn,
}: EncounterEngineViewProps) {
  const {
    activePopover,
    selectedMessageId,
    handleMessageSelect,
    setActivePopover,
    targetingHelper,
    setTargetingHelper,
    handleInvokeHelper,
    setSelectedMessageId,
    handleHelperAction,
    selectedHelper,
    setSelectedHelper,
    helperRuntimeState,
  } = useEncounterHelperContext();
  const messageWindowRef = useRef<HTMLDivElement>(null);
  const lastPlayedActorMessageIdRef = useRef<string | undefined>(undefined);
  const previousVolumeOnRef = useRef(isVolumeOn);

  useEffect(() => {
    if (isVolumeOn && !previousVolumeOnRef.current) {
      lastPlayedActorMessageIdRef.current = undefined;
    }
    previousVolumeOnRef.current = isVolumeOn;
  }, [isVolumeOn]);

  useEffect(() => {
    if (!isVolumeOn) return;
    if (!spokenActorMessageId || !currentActorResponse?.content) return;
    if (lastPlayedActorMessageIdRef.current === spokenActorMessageId) return;

    lastPlayedActorMessageIdRef.current = spokenActorMessageId;
    playAudio(currentActorResponse.content);
  }, [spokenActorMessageId, currentActorResponse, playAudio, isVolumeOn]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    const viewport = messageWindowRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );

    viewport?.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [composerMessages.length, isLoading]);
  useEffect(() => {
    if (conversationHistoryLength > 0) return;
    startDialogue();
  }, [conversationHistoryLength, startDialogue]);
  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    onSubmitUserInput(message);
    setInput("");
    setActivePopover(null);
    setTargetingHelper(null);
    setSelectedHelper(null);
    setSelectedMessageId(undefined);
  };

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (open) return;

      setActivePopover(null);
      setSelectedMessageId(undefined);
    },
    [setActivePopover, setSelectedMessageId],
  );

  return (
    <div className="from-secondary/5 border-border/55 to-primary/10 relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border-2 bg-linear-to-br">
      <EncounterEngineHeader
        onReplay={onReplay}
        onToggleAudio={onToggleAudio}
        onExit={onExit}
        isVolumeOn={isVolumeOn}
        scenario={scenario}
      />

      {/* Chat window */}
      <EncounterMessageList
        messages={composerMessages}
        isLoading={isLoading}
        ref={messageWindowRef}
        className="min-h-0 flex-1"
        actor={actor}
        isTargetingMessage={Boolean(targetingHelper)}
        selectedMessageId={selectedMessageId}
        activePopover={activePopover}
        onMessageSelect={handleMessageSelect}
        onPopoverOpenChange={handlePopoverOpenChange}
      />
      <div className="absolute bottom-6 left-1/2 z-5 mx-auto flex w-full flex-1 -translate-x-1/2 rounded-b-2xl px-10">
        <div className="w-full rounded-2xl shadow-xl">
          <DialogueComposer
            value={input}
            onValueChange={setInput}
            onClosePopover={() => setActivePopover(null)}
            onSelectMessage={setSelectedMessageId}
            selectedHelper={selectedHelper}
            onSelectHelper={setSelectedHelper}
            onChangeTargetingHelper={setTargetingHelper}
            onHelperInvoke={handleInvokeHelper}
            messages={composerMessages}
            actor={actor}
            onSend={handleSubmit}
            onHelperAction={handleHelperAction}
            placeholder="Type your response"
            disabled={isLoading}
            isSending={isLoading}
            helperConfig={HELPER_CONFIGS.soloPractice}
            helperRuntimeState={helperRuntimeState}
            activePopover={activePopover}
            onPopoverOpenChange={handlePopoverOpenChange}
            onMicClick={() =>
              onToggleListening((value) => onSubmitUserInput(value))
            }
            isListening={isListening}
            isProcessingSpeech={isProcessingSpeech}
          />
        </div>
      </div>
      {isCompleted && (
        <div className="flex-cc absolute inset-0 z-9 rounded-tl-xl bg-black/50 backdrop-blur-sm">
          <Card className="bg-surface min-h-96 w-full max-w-sm gap-2 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Encounter Completed!
              </CardTitle>
              <Image
                src={assets.chatterbrain_heart}
                alt="Encounter Completed"
                className="mx-auto h-auto w-full max-w-50"
                width={100}
                loading="lazy"
                height={100}
              />
            </CardHeader>

            <CardContent className="py-10 text-center">
              <CardDescription className="text-muted-foreground text-sm">
                Nice work! You completed this encounter successfully. Keep
                going!
              </CardDescription>
            </CardContent>

            <CardFooter className="flex justify-center gap-3">
              <CardAction>
                <Button
                  variant="outline"
                  className="shadow-lg"
                  size="icon"
                  onClick={onReplay}
                >
                  <RotateCcw />
                </Button>
              </CardAction>
              <CardAction className="flex-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onViewResults}
                >
                  View Results
                </Button>
              </CardAction>
              <CardAction className="flex-1">
                <Button variant="primary" className="w-full" onClick={onDone}>
                  Done
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
