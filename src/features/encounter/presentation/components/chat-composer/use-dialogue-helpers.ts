import { useMemo } from "react";
import { HELPER_REGISTRY } from "@/lib/constants";
import type {
  ChatMessage,
  HelperConfig,
  HelperDefinition,
  HelperRuntimeStateMap,
  ResolvedHelper,
} from "@/features/encounter/domain/types";

type UseDialogueHelpersOptions = {
  inputValue: string;
  messages?: ChatMessage[];
  helperConfig?: HelperConfig;
  helpers?: HelperDefinition[];
  runtimeState?: HelperRuntimeStateMap;
};

export function useDialogueHelpers({
  inputValue,
  messages = [],
  helperConfig: helperConfig,
  helpers = HELPER_REGISTRY,
  runtimeState,
}: UseDialogueHelpersOptions) {
  return useMemo<ResolvedHelper[]>(() => {
    if (helperConfig?.showHelpers === false) {
      return [];
    }

    const enabledHelperIds = new Set(helperConfig?.enabledHelperIds);
    const hiddenHelperIds = new Set(helperConfig?.hiddenHelperIds);
    const disabledHelperIds = new Set(helperConfig?.disabledHelperIds);
    const hasEnabledFilter = Boolean(helperConfig?.enabledHelperIds?.length);
    const hasInput = inputValue.trim().length > 0;
    const hasMessages = messages.length > 0;

    return helpers
      .filter((helper) => {
        if (hiddenHelperIds.has(helper.id)) return false;
        if (hasEnabledFilter) return enabledHelperIds.has(helper.id);
        return helper.enabledByDefault;
      })
      .map((helper) => {
        const state = runtimeState?.[helper.id];
        const missingInput = helper.availability?.requiresInput && !hasInput;
        const missingMessages =
          helper.availability?.requiresMessages && !hasMessages;
        const isDisabled =
          Boolean(state?.isDisabled) ||
          disabledHelperIds.has(helper.id) ||
          Boolean(missingInput || missingMessages);

        return {
          ...helper,
          isDisabled,
          disabledReason:
            state?.disabledReason ||
            (missingInput || missingMessages
              ? helper.availability?.disabledReason
              : undefined),
          isLoading: Boolean(state?.isLoading),
        };
      });
  }, [inputValue, messages, runtimeState, helperConfig, helpers]);
}
