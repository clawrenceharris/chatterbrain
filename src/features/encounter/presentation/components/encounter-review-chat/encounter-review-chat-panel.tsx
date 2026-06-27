"use client";

import { Button, ScrollArea } from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { CHITTER } from "@/features/ai/persona";
import { assets } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Loader2, Send, User } from "lucide-react";
import Image from "next/image";
import { FormEvent, ReactNode, useState } from "react";
import { useEncounterReviewChat } from "../../hooks";

const SUGGESTED_QUESTIONS = [
  "What should I try next?",
  "Which response was strongest?",
  "Rewrite my weakest turn",
  "How did I do on clarity?",
];

type EncounterReviewChatPanelProps = {
  encounterId: string;
  className?: string;
};

export function EncounterReviewChatPanel({
  encounterId,
  className,
}: EncounterReviewChatPanelProps) {
  const [draft, setDraft] = useState("");
  const { ask, error, isLoading, messages } = useEncounterReviewChat({
    encounterId,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;

    setDraft("");
    await ask(question);
  }

  async function handleSuggestion(question: string) {
    setDraft("");
    await ask(question);
  }

  return (
    <aside
      className={cn(
        "bg-background border-border/55 flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border-2",
        className,
      )}
    >
      <ScrollArea className="relative min-h-0 flex-1 px-5 py-4">
        {messages.length === 0 ? (
          <div className="bg-muted/35 border-border/50 flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 px-5 text-center">
            <Image
              src={assets.chatterbrain_chat_bubble}
              alt={CHITTER.displayName}
              className="mb-3 size-16 object-contain"
            />
            <p className="font-heading text-lg font-semibold">
              Chitter has your review.
            </p>
            <p className="text-muted-foreground mt-1 max-w-[28ch] text-sm">
              Ask for a rewrite, a next step, or a quick explanation of your
              scores.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <ChatAvatar className="bg-primary/15 p-0.5">
                    <Image
                      src={assets.chatterbrain_smile_sticker}
                      alt={CHITTER.displayName}
                      className="size-7 object-contain"
                    />
                  </ChatAvatar>
                )}
                <div
                  className={cn(
                    "max-w-[86%] rounded-2xl border-2 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    message.role === "user"
                      ? "border-primary/25 bg-primary text-primary-foreground rounded-br-md"
                      : "border-border/55 bg-muted/40 text-foreground rounded-bl-md",
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <ChatAvatar className="bg-muted text-muted-foreground">
                    <User className="size-4" />
                  </ChatAvatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" />
                {CHITTER.loadingMessage}
              </div>
            )}
          </div>
        )}
        <div className="faded-row absolute right-0 bottom-0 left-0 w-full min-w-0 overflow-hidden">
          <div
            className="flex gap-2 overflow-x-auto px-3 py-2"
            style={{
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For Internet Explorer and Edge
            }}
          >
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="hide-scrollbar flex gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <Button
                  key={question}
                  type="button"
                  variant="outline"
                  size="xs"
                  disabled={isLoading}
                  onClick={() => void handleSuggestion(question)}
                  className="border-border/70 bg-muted/20 text-muted-foreground hover:text-foreground"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-border/55 px-3 py-2">
        <form onSubmit={handleSubmit}>
          <InputGroup className="border-border/60 bg-input/70 rounded-2xl border-2">
            <InputGroupTextarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask about this review..."
              rows={3}
              disabled={isLoading}
              className="min-h-22 text-base"
            />
            <InputGroupAddon align="block-end" className="justify-end">
              <InputGroupButton
                type="submit"
                variant="primary"
                size="icon-sm"
                disabled={isLoading || draft.trim().length === 0}
                className="rounded-full"
                aria-label="Send review question"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
        {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
      </div>
    </aside>
  );
}

function ChatAvatar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-border/50 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
