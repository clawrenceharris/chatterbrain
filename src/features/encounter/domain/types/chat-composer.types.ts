import type { HelperAction } from ".";
import type {
  HelperConfig,
  HelperPopoverState,
  HelperDefinition,
  HelperRuntimeStateMap,
  ResolvedHelper,
  HelperExecutionResult,
} from ".";
import { EncounterPageActor } from "../../application/dto";
import { ChatMessage } from "../value-objects";

export type ChatComposerProps = {
  actor: EncounterPageActor | null;
  messages: ChatMessage[];
  value: string;
  onValueChange: (value: string) => void;
  onSend: (message: string) => void | Promise<void>;
  onClosePopover: () => void;
  onSelectMessage: (messageId: string | undefined) => void;
  onSelectHelper: (helper: ResolvedHelper | null) => void;
  onChangeTargetingHelper: (helper: HelperDefinition | null) => void;
  onHelperInvoke: (request: HelperExecutionRequest) => void;
  placeholder?: string;
  activePopover?: HelperPopoverState;
  selectedHelper?: ResolvedHelper | null;
  disabled?: boolean;
  isSending?: boolean;
  onHelperAction?: (ctx: ChatComposerContext, action: HelperAction) => void;
  helperConfig?: HelperConfig;
  helpers?: HelperDefinition[];
  helperRuntimeState?: HelperRuntimeStateMap;
  onPopoverOpenChange?: (open: boolean) => void;
  onMicClick?: () => void | Promise<void>;
  showMicButton?: boolean;
  isListening?: boolean;
  isProcessingSpeech?: boolean;
};

export type ChatComposerContext = {
  value: string;
  onValueChange: (value: string) => void;
  helperConfig?: HelperConfig;
  selectedHelper?: ResolvedHelper | null;
  activePopover?: HelperPopoverState;
  isSending?: boolean;
};

export type HelperExecutionRequest = {
  helper: HelperDefinition;
  input: string;
  context?: ChatComposerContext;
  targetMessage?: ChatMessage;
};

export type HelperInvokeHandler = (
  request: HelperExecutionRequest,
) => HelperExecutionResult | Promise<HelperExecutionResult>;
