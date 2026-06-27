"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  ResolvedHelper,
  ChatMessage,
  HelperDefinition,
  HelperExecutionRequest,
  HelperExecutionResult,
  HelperPopoverState,
  HelperRuntimeStateMap,
  ChatComposerContext,
  HelperAction,
  InvokedHelper,
  HelperPopoverContent,
  InvokedHelperPayload,
} from "@/features/encounter/domain/types";

type HelperContextType = {
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

const HelperContext = createContext<HelperContextType | undefined>(undefined);
export function HelperProvider({ children }: { children: React.ReactNode }) {
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
      console.log("handleHelperAction", action);
      switch (action.behavoir) {
        case "transform-input":
          console.log("transform-input", action.text);
          ctx.onValueChange(action.text);
          break;
        default:
          throw new Error("Invalid action");
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
  function fetchHelperPayload(
    helper: HelperDefinition,
  ): Promise<InvokedHelperPayload> {
    switch (helper.id) {
      case "rephraser":
        return Promise.resolve({
          id: helper.id,
          text: "Chitter sees a clear main point here. To make it softer, add a short acknowledgement before the request.",
          actions: [
            {
              behavoir: "transform-input",
              text: "I get what you mean. It can be hard when you don't have the words.",
              onClick: (helper: InvokedHelper, option: string) => {
                helper.context?.onValueChange(option);
              },
            },
          ],
        });
      case "tone-analyzer":
        return Promise.resolve({
          id: helper.id,
          text: "Chitter notices this may sound a little distant. A warmer version could show you heard the feeling behind the words.",
        });
      case "vibe-check":
        return Promise.resolve({
          id: helper.id,
          text: "Chitter reads this as friendly and direct. If you want a gentler vibe, add one acknowledgement before your main point.",
        });
      case "cue-detector": {
        return Promise.resolve({
          id: helper.id,
          text: "Chitter sees a useful cue here: notice what the other person might be feeling before choosing your next line.",
        });
      }
      case "response-builder": {
        return Promise.resolve({
          id: helper.id,
          text: "Chitter can help you pick a response that is clear and easy to answer.",
          actions: [
            {
              behavoir: "transform-input",
              text: "I get what you mean. It can be hard when you don't have the words.",
              onClick: (helper: InvokedHelper, option: string) => {
                helper.context?.onValueChange(option);
              },
            },
            {
              behavoir: "transform-input",
              text: "I understand. It can be hard when you don't have the words.",
              onClick: (helper: InvokedHelper, option: string) => {
                helper.context?.onValueChange(option);
              },
            },
          ],
        });
      }
      default:
        throw new Error(`Invalid helper: ${helper.id}`);
    }
  }
  const handleInvokeHelper = useCallback(
    async ({
      helper,
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
        const payload = await fetchHelperPayload(helper);
        const invokedHelper: InvokedHelper = {
          ...helper,
          payload,
        };
        const popover: HelperPopoverContent | undefined =
          helper.id === "response-builder"
            ? {
                title: "Response Builder",
                description:
                  "Chitter found a few possible ways you could respond next:",
              }
            : helper.id === "rephraser"
              ? {
                  title: "Rephraser",
                  description:
                    "Chitter made your draft a little easier to read:",
                }
              : helper.id === "vibe-check"
                ? {
                    title: "Vibe Check",
                    description: "Chitter checked how this might land:",
                    body: "This draft sounds friendly and direct. If you want it softer, add a short acknowledgement before your main point.",
                  }
                : undefined;

        if (!popover) throw new Error("No popover found for tool");

        setActivePopover({
          helper: invokedHelper,
          content: popover,
        });

        return invokedHelper;
      } finally {
        setHelperLoading(helper.id, false);
      }
    },
    [setHelperLoading],
  );

  const handleMessageSelect = useCallback(
    (message: ChatMessage) => {
      if (!targetingHelper) return;

      setSelectedMessageId(message.id);
      setActivePopover({
        helper: {
          ...targetingHelper,
          payload: {
            id: targetingHelper.id,
            text: "Chitter found one thing worth noticing in this message.",
          },
        },
        targetMessageId: message.id,
        content: {
          title: targetingHelper.label,
          description: "Chitter found a useful detail here:",
          body:
            message.role === "actor"
              ? "This actor message may include a social cue. Notice the feeling behind the words before choosing your response."
              : "This message is clear enough for practice. A next pass could make the intent even more explicit.",
        },
      });
      setTargetingHelper(null);
    },
    [targetingHelper],
  );
  const value = useMemo<HelperContextType>(
    () => ({
      activePopover,
      targetingHelper: targetingHelper,
      setTargetingHelper,
      helperRuntimeState,
      setHelperRuntimeState,
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
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  );
}

export function useHelperContext() {
  const context = useContext(HelperContext);
  if (!context) {
    throw new Error("useHelperContext must be used within a HelperProvider");
  }
  return context;
}
