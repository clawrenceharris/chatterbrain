"use client";

import { Loader2, Mic, Send, Square } from "lucide-react";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Popover,
  PopoverAnchor,
} from "@/components/ui";
import type {
  ChatComposerContext,
  ChatComposerProps,
  HelperAction,
  ResolvedHelper,
} from "@/features/encounter/domain/types";
import { cn } from "@/lib/utils";
import { DialogueToolBar } from "./dialogue-tool-bar";
import { HelperPopover } from "./helper-popover";
import { useDialogueHelpers } from "./use-dialogue-helpers";
import Image from "next/image";
import { useMemo } from "react";

export function DialogueComposer({
  messages,
  value,
  onValueChange,
  onSend,
  placeholder = "Type your response...",
  disabled,
  isSending,
  helperConfig,
  helpers,
  helperRuntimeState,
  onPopoverOpenChange,
  onMicClick,
  onHelperAction,
  showMicButton,
  isListening,
  isProcessingSpeech,
  onClosePopover,
  onSelectMessage,
  onSelectHelper,
  onChangeTargetingHelper,
  onHelperInvoke,
  selectedHelper,
  activePopover,
}: ChatComposerProps) {
  const resolvedHelpers = useDialogueHelpers({
    inputValue: value,
    messages,
    helperConfig: helperConfig,
    helpers: helpers,
    runtimeState: helperRuntimeState,
  });

  const micVisible = showMicButton ?? helperConfig?.showMicButton ?? true;

  const isDisabled = Boolean(disabled || isSending || isProcessingSpeech);
  async function submitMessage() {
    const message = value.trim();
    if (!message || isDisabled) return;

    await onSend(message);
  }
  const composerContext = useMemo<ChatComposerContext>(
    () => ({
      value,
      selectedHelper,
      onValueChange,
      helperConfig,
    }),
    [value, selectedHelper, onValueChange, helperConfig],
  );
  function handleHelperAction(action: HelperAction) {
    onHelperAction?.(composerContext, action);
  }
  function handleActivateHelper(helper: ResolvedHelper) {
    if (helper.isDisabled || helper.isLoading) return;
    onHelperInvoke({
      helper,
      input: value,
      context: composerContext,
    });
  }

  return (
    <Popover
      open={Boolean(activePopover)}
      onOpenChange={(open) => onPopoverOpenChange?.(open)}
    >
      <PopoverAnchor asChild>
        <form
          className="relative w-full"
          onSubmit={(event) => {
            event.preventDefault();
            void submitMessage();
          }}
        >
          {selectedHelper && (
            <Item
              variant="muted"
              className="border-border ring-surface absolute bottom-40 left-0 w-full max-w-2xl border ring-3"
            >
              <ItemMedia className="size-25" variant="image">
                <Image
                  src={selectedHelper.icon}
                  alt={selectedHelper.label}
                  width={300}
                  height={300}
                  className="size-full rounded-full"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="font-heading text-foreground/70 text-2xl font-bold">
                  {selectedHelper.label}
                </ItemTitle>
                <ItemDescription>{selectedHelper.description}</ItemDescription>
              </ItemContent>
              <ItemActions className="justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onSelectHelper(null);
                    onChangeTargetingHelper(null);
                    onSelectMessage(undefined);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    handleActivateHelper(selectedHelper);
                    onSelectHelper(null);
                  }}
                >
                  Activate
                </Button>
              </ItemActions>
            </Item>
          )}
          <InputGroup className="bg-input border-muted relative rounded-2xl border-3">
            <InputGroupTextarea
              id="chat-composer"
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submitMessage();
                }
              }}
              placeholder={placeholder}
              disabled={disabled || isSending || isProcessingSpeech}
              rows={2}
              maxLength={500}
              className="min-h-18 px-5 text-base"
            />

            <InputGroupAddon
              align="block-end"
              className="border-border/50 justify-between gap-3"
            >
              <DialogueToolBar
                helpers={resolvedHelpers}
                onHelperClick={onSelectHelper}
              />

              <div className="ml-auto flex items-center gap-2">
                {micVisible ? (
                  <InputGroupButton
                    size="icon-sm"
                    variant="ghost"
                    className={cn(
                      "rounded-full",
                      isListening && "bg-destructive/20 text-destructive",
                    )}
                    disabled={
                      disabled ||
                      isSending ||
                      (isProcessingSpeech && !isListening)
                    }
                    title={
                      isListening ? "Stop listening" : "Speak your response"
                    }
                    aria-label={
                      isListening ? "Stop listening" : "Speak your response"
                    }
                    onClick={() => void onMicClick?.()}
                  >
                    {isListening && isProcessingSpeech ? (
                      <Square />
                    ) : isProcessingSpeech ? (
                      <Loader2 strokeWidth={2.5} className="animate-spin" />
                    ) : (
                      <Mic />
                    )}
                  </InputGroupButton>
                ) : null}

                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  variant="primary"
                  className="rounded-full"
                  disabled={!value.trim() || isDisabled}
                  aria-label="Send message"
                >
                  {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </PopoverAnchor>

      {activePopover && (
        <HelperPopover
          onClose={() => onClosePopover?.()}
          onHelperActionClick={handleHelperAction}
          state={activePopover}
          align="start"
        />
      )}
    </Popover>
  );
}
