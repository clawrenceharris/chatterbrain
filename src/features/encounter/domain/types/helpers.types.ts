import { StaticImageData } from "next/image";
import { ChatComposerContext } from "./chat-composer.types";

export type ResolvedHelper = HelperDefinition & {
  isDisabled: boolean;
  disabledReason?: string;
  isLoading: boolean;
};

export type HelperAction = {
  behavoir: "transform-input";
  text: string;
  onClick?: (helper: InvokedHelper, option: string) => void;
};
export type InvokedHelper = {
  context?: ChatComposerContext;
  payload: InvokedHelperPayload;
} & HelperDefinition & {};

export type InvokedHelperPayload = {
  id: HelperId;
  text?: string;
  tone?: string;
  actions?: HelperAction[];
};

export type HelperDefinition = {
  id: HelperId;
  label: string;
  shortLabel: string;
  description: string;
  behavior: HelperBehavior;
  icon: StaticImageData;
  enabledByDefault: boolean;
  availability?: HelperAvailability;
};

export type HelperId =
  | "tone-analyzer"
  | "vibe-check"
  | "rephraser"
  | "response-builder"
  | "cue-detector";

export type HelperBehavior =
  | "transform-input"
  | "details-from-input"
  | "detail-from-message";

export type HelperAvailability = {
  requiresInput?: boolean;
  requiresMessages?: boolean;
  disabledReason?: string;
};

export type HelperConfig = {
  enabledHelperIds?: HelperId[];
  hiddenHelperIds?: HelperId[];
  disabledHelperIds?: HelperId[];
  showHelpers?: boolean;
  showMicButton?: boolean;
};

export type HelperRuntimeState = {
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
};

export type HelperRuntimeStateMap = Partial<
  Record<HelperId, HelperRuntimeState>
>;

export type HelperPopoverContent = {
  title: string;
  description?: string;
  body?: string;
  tone?: string;
  suggestions?: string[];
};

export type HelperPopoverState = {
  helper: InvokedHelper;
  content: HelperPopoverContent;
  targetMessageId?: string;
} | null;

export type HelperExecutionResult =
  | InvokedHelper
  | {
      behavior: "detail-from-message";
      status: "enter-targeting" | "cancel-targeting";
    };
