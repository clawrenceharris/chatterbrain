"use client";

import { forwardRef } from "react";
import type {
  ChatMessage,
  HelperPopoverState,
} from "@/features/encounter/domain/types";
import {
  AvatarImage,
  Avatar,
  AvatarFallback,
  ScrollArea,
} from "@/components/ui";
import { MessageBubble } from "./message-bubble";
import { cn } from "@/lib/utils";
import { EncounterPageActor } from "@/features/encounter/application/dto";

type EncounterMessageListProps = {
  messages: ChatMessage[];
  actor: EncounterPageActor;
  isLoading?: boolean;
  isTargetingMessage?: boolean;
  selectedMessageId?: string;
  activePopover?: HelperPopoverState;
  className?: string;
  onMessageSelect?: (message: ChatMessage) => void;
  onPopoverOpenChange?: (open: boolean) => void;
};

export const EncounterMessageList = forwardRef<
  HTMLDivElement,
  EncounterMessageListProps
>(
  (
    {
      messages,
      actor,
      isLoading,
      isTargetingMessage,
      selectedMessageId,
      className,
      onMessageSelect,
    },
    ref,
  ) => {
    return (
      <ScrollArea ref={ref} className={cn("h-full min-h-0", className)}>
        <div className="flex min-h-full flex-col gap-4 px-10 pt-5 pb-49">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              avatarUrl={message.avatarUrl}
              isTargeting={isTargetingMessage}
              isSelected={selectedMessageId === message.id}
              onSelect={onMessageSelect}
            />
          ))}

          {isLoading ? (
            <div
              className={cn(
                "animate-message-slide-in font-body flex items-end gap-3",
              )}
            >
              <Avatar size="lg">
                <AvatarImage src={actor.avatarUrl ?? "#"} />

                <AvatarFallback
                  className={cn("bg-muted text-muted-foreground")}
                >
                  {actor.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="max-w-[70%]">
                <div className="font-heading text-muted-foreground mb-1 font-semibold">
                  {actor.displayName}
                </div>

                <div
                  className={cn(
                    "bg-card relative rounded-xl px-6 py-4 text-left wrap-break-word",
                    "text-foreground rounded-bl-[7px] bg-linear-to-br shadow-md",
                  )}
                >
                  <div className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-3">
                    <div
                      className="animate-typing-dots h-2 w-2 rounded-[999px] bg-gray-400"
                      style={{ animationDelay: "-0.32s" }}
                    />
                    <div
                      className="animate-typing-dots h-2 w-2 rounded-[999px] bg-gray-400"
                      style={{ animationDelay: "-0.16s" }}
                    />
                    <div className="animate-typing-dots h-2 w-2 rounded-[999px] bg-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    );
  },
);

EncounterMessageList.displayName = "EncounterMessageList";
