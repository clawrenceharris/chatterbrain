"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { invokeEncounterHelper } from "@/actions/encounter";
import type {
  EncounterPageOutput,
  InvokeEncounterHelperActionInput,
  InvokeEncounterHelperOutput,
} from "@/features/encounter/application/dto";
import { buildEncounterHelperCacheKey } from "@/features/encounter/application/helpers/buildEncounterHelperCacheKey";
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
  data: InvokeEncounterHelperOutput,
): InvokedHelperPayload {
  const { text, tone, suggestions = [], rewrittenDraft } = data;

  if (helperId === "response-builder") {
    return {
      id: helperId,
      actions: suggestions.map((suggestion) => ({
        behavoir: "transform-input" as const,
        text: suggestion,
      })),
    };
  }

  if (helperId === "rephraser" && rewrittenDraft?.trim()) {
    return {
      id: helperId,
      actions: [
        {
          behavoir: "transform-input" as const,
          text: rewrittenDraft.trim(),
        },
      ],
    };
  }

  if (helperId === "tone-analyzer") {
    return {
      id: helperId,
      tone,
      text,
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
        description: "Tap one to use it:",
      };
    case "rephraser":
      return {
        title: "Rephraser",
        description: "Tap to use this rewrite:",
      };
    case "vibe-check":
      return {
        title: "Vibe Check",
        body: payload.text,
      };
    case "tone-analyzer":
      return {
        title: "Tone Analyzer",
        tone: payload.tone,
        body: payload.text,
      };
    case "cue-detector":
      return {
        title: "Cue Detector",
        body: payload.text,
      };
    default:
      return {
        title: "Helper",
        body: payload.text,
      };
  }
}

function openHelperPopover(
  helper: HelperDefinition,
  data: InvokeEncounterHelperOutput,
  targetMessageId: string | undefined,
  setActivePopover: (popover: HelperPopoverState) => void,
) {
  const payload = buildPayload(helper.id, data);
  setActivePopover({
    helper: {
      ...helper,
      payload,
    },
    targetMessageId,
    content: buildPopoverContent(helper.id, payload),
  });
}

async function fetchHelperResult(
  input: InvokeEncounterHelperActionInput,
  cache: Map<string, InvokeEncounterHelperOutput>,
): Promise<InvokeEncounterHelperOutput> {
  const cacheKey = buildEncounterHelperCacheKey(input);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await invokeEncounterHelper(input);
  if (!result.success) {
    throw new Error(result.error.message);
  }

  cache.set(cacheKey, result.data);
  return result.data;
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
  const helperResultCacheRef = useRef(
    new Map<string, InvokeEncounterHelperOutput>(),
  );

  useEffect(() => {
    helperResultCacheRef.current.clear();
  }, [encounter.id]);

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
      try {
        if (helper.behavior === "detail-from-message") {
          setHelperLoading(helper.id, true);
          setTargetingHelper(helper);
          setSelectedMessageId(undefined);
          setActivePopover(null);

          return {
            behavior: "detail-from-message",
            status: "enter-targeting",
          };
        }

        const requestInput: InvokeEncounterHelperActionInput = {
          helperId: helper.id,
          ...buildHelperContext({
            encounter,
            messages,
            draftInput: input,
          }),
        };

        const cacheKey = buildEncounterHelperCacheKey(requestInput);
        const isCached = helperResultCacheRef.current.has(cacheKey);
        if (!isCached) {
          setHelperLoading(helper.id, true);
        }

        const data = await fetchHelperResult(
          requestInput,
          helperResultCacheRef.current,
        );
        const payload = buildPayload(helper.id, data);
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
        if (helper.behavior !== "detail-from-message") {
          setHelperLoading(helper.id, false);
        }
      }
    },
    [encounter, messages, setHelperLoading],
  );

  const handleMessageSelect = useCallback(
    async (message: ChatMessage) => {
      if (!targetingHelper) return;

      setSelectedMessageId(message.id);

      const requestInput: InvokeEncounterHelperActionInput = {
        helperId: targetingHelper.id,
        ...buildHelperContext({
          encounter,
          messages,
          targetMessage: message,
        }),
      };

      const isCached = helperResultCacheRef.current.has(
        buildEncounterHelperCacheKey(requestInput),
      );

      try {
        if (!isCached) {
          setHelperLoading(targetingHelper.id, true);
        }

        const data = await fetchHelperResult(
          requestInput,
          helperResultCacheRef.current,
        );
        openHelperPopover(targetingHelper, data, message.id, setActivePopover);
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
