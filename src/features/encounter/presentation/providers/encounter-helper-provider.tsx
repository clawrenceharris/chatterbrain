"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { invokeEncounterHelper } from "@/actions/encounter";
import type { EncounterPageOutput } from "@/features/encounter/application/dto";
import type {
  ChatComposerContext,
  ChatMessage,
  HelperAction,
  HelperDefinition,
  HelperExecutionRequest,
  HelperExecutionResult,
  HelperPopoverContent,
  HelperPopoverState,
  HelperRuntimeStateMap,
  InvokedHelper,
  InvokedHelperPayload,
  ResolvedHelper,
} from "@/features/encounter/domain/types";

type EncounterHelperContextType = {
  activePopover: HelperPopoverState | null;
  targetingHelper: HelperDefinition | null;
  setTargetingHelper: (helper: HelperDefinition | null) => void;
  helperRuntimeState: HelperRuntimeStateMap;
  selectedMessageId: string | undefined;
  handleMessageSelect: (message: ChatMessage) => void;
  setSelectedMessageId: (messageId: string | undefined) => void;
  selectedHelper: ResolvedHelper | null;
  setSelectedHelper: (helper: ResolvedHelper | null) => void;
  handleHelperAction: (
    ctx: ChatComposerContext,
    action: HelperAction,
  ) => Promise<void> | void;
  setActivePopover: (popover: HelperPopoverState | null) => void;
  handleInvokeHelper: (
    request: HelperExecutionRequest,
  ) => Promise<HelperExecutionResult>;
};

const EncounterHelperContext = createContext<
  EncounterHelperContextType | undefined
>(undefined);

type EncounterHelperProviderProps = {
  children: React.ReactNode;
  encounter: EncounterPageOutput;
  messages: ChatMessage[];
};

function toHelperMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
    speakerName: message.speakerName,
  }));
}

function buildHelperContext(input: {
  encounter: EncounterPageOutput;
  messages: ChatMessage[];
  draftInput?: string;
  targetMessage?: ChatMessage;
}) {
  return {
    conversationHistory: toHelperMessages(input.messages),
    draftInput: input.draftInput,
    targetMessage: input.targetMessage
      ? {
          role: input.targetMessage.role,
          content: input.targetMessage.content,
          speakerName: input.targetMessage.speakerName,
        }
      : undefined,
    scenario: {
      title: input.encounter.scenario.title,
      setting: input.encounter.scenario.setting,
      actorRole: input.encounter.scenario.actorRole,
      focusSkills: input.encounter.scenario.focusSkills,
    },
    actor: {
      displayName: input.encounter.actor.displayName,
      personalityTraits: input.encounter.actor.personalityTraits,
      communicationStyle: input.encounter.actor.communicationStyle,
      description: input.encounter.actor.description,
    },
  };
}

function buildPayload(
  helperId: HelperDefinition["id"],
  result: Awaited<ReturnType<typeof invokeEncounterHelper>>,
): InvokedHelperPayload {
  if (!result.success) {
    throw new Error(result.error.message);
  }

  const { text, suggestions = [], rewrittenDraft } = result.data;

  if (helperId === "response-builder") {
    return {
      id: helperId,
      text,
      actions: suggestions.map((suggestion) => ({
        behavoir: "transform-input" as const,
        text: suggestion,
      })),
    };
  }

  if (helperId === "rephraser") {
    const actions = [rewrittenDraft, ...suggestions]
      .filter((value): value is string => Boolean(value?.trim()))
      .map((suggestion) => ({
        behavoir: "transform-input" as const,
        text: suggestion,
      }));

    return {
      id: helperId,
      text,
      actions,
    };
  }

  return {
    id: helperId,
    text,
  };
}

function buildPopoverContent(
  helperId: HelperDefinition["id"],
  payload: InvokedHelperPayload,
): HelperPopoverContent {
  switch (helperId) {
    case "response-builder":
      return {
        title: "Response Builder",
        description:
          "Chitter found a few possible ways you could respond next:",
        body: payload.text,
      };
    case "rephraser":
      return {
        title: "Rephraser",
        description: "Chitter made your draft a little easier to read:",
        body: payload.text,
      };
    case "vibe-check":
      return {
        title: "Vibe Check",
        description: "Chitter checked how this might land:",
        body: payload.text,
      };
    case "tone-analyzer":
      return {
        title: "Tone Analyzer",
        description: "Chitter inspected the tone of this message:",
        body: payload.text,
      };
    case "cue-detector":
      return {
        title: "Cue Detector",
        description: "Chitter found a useful social cue here:",
        body: payload.text,
      };
    default:
      return {
        title: "Helper",
        body: payload.text,
      };
  }
}

export function EncounterHelperProvider({
  children,
  encounter,
  messages,
}: EncounterHelperProviderProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | undefined
  >(undefined);
  const [activePopover, setActivePopover] = useState<HelperPopoverState | null>(
    null,
  );
  const [targetingHelper, setTargetingHelper] =
    useState<HelperDefinition | null>(null);
  const [helperRuntimeState, setHelperRuntimeState] =
    useState<HelperRuntimeStateMap>({});
  const [selectedHelper, setSelectedHelper] = useState<ResolvedHelper | null>(
    null,
  );

  const handleHelperAction = useCallback(
    (ctx: ChatComposerContext, action: HelperAction) => {
      if (action.behavoir === "transform-input") {
        ctx.onValueChange(action.text);
      }
    },
    [],
  );

  const setHelperLoading = useCallback(
    (helperId: HelperDefinition["id"], isLoading: boolean) => {
      setHelperRuntimeState((current) => ({
        ...current,
        [helperId]: {
          ...current[helperId],
          isLoading,
        },
      }));
    },
    [],
  );

  const handleInvokeHelper = useCallback(
    async ({
      helper,
      input,
    }: HelperExecutionRequest): Promise<HelperExecutionResult> => {
      setHelperLoading(helper.id, true);

      try {
        if (helper.behavior === "detail-from-message") {
          setTargetingHelper(helper);
          setSelectedMessageId(undefined);
          setActivePopover(null);

          return {
            behavior: "detail-from-message",
            status: "enter-targeting",
          };
        }

        const result = await invokeEncounterHelper({
          helperId: helper.id,
          ...buildHelperContext({
            encounter,
            messages,
            draftInput: input,
          }),
        });

        const payload = buildPayload(helper.id, result);
        const invokedHelper: InvokedHelper = {
          ...helper,
          payload,
        };

        setActivePopover({
          helper: invokedHelper,
          content: buildPopoverContent(helper.id, payload),
        });

        return invokedHelper;
      } finally {
        setHelperLoading(helper.id, false);
      }
    },
    [encounter, messages, setHelperLoading],
  );

  const handleMessageSelect = useCallback(
    async (message: ChatMessage) => {
      if (!targetingHelper) return;

      setSelectedMessageId(message.id);
      setHelperLoading(targetingHelper.id, true);

      try {
        const result = await invokeEncounterHelper({
          helperId: targetingHelper.id,
          ...buildHelperContext({
            encounter,
            messages,
            targetMessage: message,
          }),
        });

        const payload = buildPayload(targetingHelper.id, result);
        setActivePopover({
          helper: {
            ...targetingHelper,
            payload,
          },
          targetMessageId: message.id,
          content: buildPopoverContent(targetingHelper.id, payload),
        });
      } finally {
        setTargetingHelper(null);
        setHelperLoading(targetingHelper.id, false);
      }
    },
    [encounter, messages, setHelperLoading, targetingHelper],
  );

  const value = useMemo<EncounterHelperContextType>(
    () => ({
      activePopover,
      targetingHelper,
      setTargetingHelper,
      helperRuntimeState,
      selectedMessageId,
      setActivePopover,
      handleHelperAction,
      handleInvokeHelper,
      handleMessageSelect,
      setSelectedMessageId,
      selectedHelper,
      setSelectedHelper,
    }),
    [
      activePopover,
      targetingHelper,
      helperRuntimeState,
      selectedMessageId,
      handleHelperAction,
      handleInvokeHelper,
      handleMessageSelect,
      selectedHelper,
    ],
  );

  return (
    <EncounterHelperContext.Provider value={value}>
      {children}
    </EncounterHelperContext.Provider>
  );
}

export function useEncounterHelperContext() {
  const context = useContext(EncounterHelperContext);
  if (!context) {
    throw new Error(
      "useEncounterHelperContext must be used within an EncounterHelperProvider",
    );
  }
  return context;
}
