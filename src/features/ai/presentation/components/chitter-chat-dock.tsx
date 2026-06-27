"use client";

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  ScrollArea,
  Switch,
} from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { CHITTER } from "@/features/ai/persona";
import { assets } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { useChitterChat } from "../providers";
import { ChitterScenarioCard } from "./chitter-scenario-card";
import { AnimatePresence, motion } from "motion/react";

const GLOBAL_SUGGESTIONS = [
  "What should I practice next?",
  "Find me a scenario for conflict.",
  "How do I get better at small talk?",
];

export function ChitterChatDock() {
  const pathname = usePathname();
  const [draft, setDraft] = useState("");
  const {
    ask,
    close,
    error,
    isLoading,
    isOpen,
    messages,
    mockMode,
    setMockMode,
    toggle,
  } = useChitterChat();

  if (shouldHideChitterDock(pathname)) {
    return null;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;

    setDraft("");
    await ask(question, pathname);
  }

  async function handleSuggestion(question: string) {
    setDraft("");
    await ask(question, pathname);
  }

  function handleClose(open: boolean) {
    if (!open) {
      close();
    }
  }
  return (
    <Drawer open={isOpen} direction="bottom" onOpenChange={handleClose}>
      <DrawerContent
        overlayClassName="backdrop-blur-none!"
        className="left-1/2! min-h-[500px] w-full! max-w-3xl -translate-x-1/2!"
      >
        <DrawerHeader className="contents space-y-0 text-left">
          <DrawerTitle className="py-5">
            Ask {CHITTER.displayName} a question
          </DrawerTitle>
          <div className="relative h-[330px] overflow-hidden">
            <ScrollArea className="h-full min-h-0">
              <DrawerDescription className="sr-only">
                Ask questions, get answers, and get recommendations.
              </DrawerDescription>
              <div className="min-h-full px-4 pt-4 pb-10">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Image
                      src={assets.chatterbrain_chat_bubble}
                      alt={CHITTER.displayName}
                      className="mb-3 size-18 object-contain"
                    />
                    <p className="font-heading text-lg font-semibold">
                      Hi, I&apos;m {CHITTER.displayName}.
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Ask me what to practice next or tell me a goal you want
                      help with.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pb-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        {message.role === "assistant" && <ChitterAvatar />}
                        <div className="flex max-w-[86%] flex-col gap-3">
                          <div
                            className={cn(
                              "rounded-2xl border-2 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                              message.role === "user"
                                ? "border-primary/25 bg-primary text-primary-foreground rounded-br-md"
                                : "text-foreground border-transparent bg-transparent p-0 text-left",
                            )}
                          >
                            {message.content}
                          </div>
                          {message.role === "assistant" &&
                            message.recommendedScenarios?.map(
                              (recommendation) => (
                                <ChitterScenarioCard
                                  key={recommendation.scenario.id}
                                  recommendation={recommendation}
                                  onOpenScenario={close}
                                />
                              ),
                            )}
                        </div>
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
              </div>
              <div className="absolute right-0 bottom-0 left-0 mb-3 flex flex-wrap gap-2 bg-transparent px-5">
                {GLOBAL_SUGGESTIONS.map((question) => (
                  <Button
                    key={question}
                    type="button"
                    variant="outline"
                    size="xs"
                    disabled={isLoading}
                    onClick={() => void handleSuggestion(question)}
                    className="border-border/70 bg-surface text-muted-foreground hover:text-foreground"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DrawerHeader>
        <DrawerFooter className="bg-transparent p-0">
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
                placeholder="Chat with Chitter..."
                rows={3}
                disabled={isLoading}
                className="min-h-20 text-base"
              />
              <InputGroupAddon align="block-end" className="justify-between">
                <label className="text-muted-foreground flex items-center gap-2 text-sm">
                  Mock
                  <Switch
                    size="sm"
                    checked={mockMode}
                    onCheckedChange={setMockMode}
                    aria-label="Toggle Chitter mock mode"
                  />
                </label>
                <InputGroupButton
                  type="submit"
                  variant="primary"
                  size="icon-sm"
                  disabled={isLoading || draft.trim().length === 0}
                  className="rounded-full"
                  aria-label="Send question to Chitter"
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
        </DrawerFooter>
      </DrawerContent>
      <AnimatePresence mode="sync">
        {!isOpen && (
          <Button
            className="hover:bg-tertiary fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 rounded-[999] border-2 pr-1 text-xl font-bold hover:scale-105 md:bottom-6"
            type="button"
            variant="tertiary"
            size="lg"
            asChild
            onClick={toggle}
          >
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.2 }}
            >
              <span className="hidden sm:inline">
                Ask {CHITTER.displayName}
              </span>
              <Image
                src={assets.chatterbrain_chat_bubble}
                alt=""
                width={300}
                height={300}
                className="size-9 object-contain"
              />
            </motion.button>
          </Button>
        )}
      </AnimatePresence>
    </Drawer>
  );
}

function ChitterAvatar() {
  return (
    <span className="border-border/50 bg-surface flex size-8 shrink-0 items-center justify-center rounded-full border-2 p-0.5">
      <Image
        src={assets.chatterbrain_chat_bubble}
        alt={CHITTER.displayName}
        className="size-10 object-contain"
      />
    </span>
  );
}

function shouldHideChitterDock(pathname: string | null) {
  if (!pathname) return false;
  return /^\/encounters\/[^/]+(?:\/results)?$/.test(pathname);
}
