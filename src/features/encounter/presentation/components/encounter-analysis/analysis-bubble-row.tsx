"use client";

import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Lightbulb, Loader2, MessageSquare } from "lucide-react";

type InsightState = {
  text: string;
  isStreaming: boolean;
  isLoading: boolean;
  hasContent: boolean;
};

type AnalysisBubbleRowProps = {
  speakerName: string;
  content: string;
  role: "user" | "actor";
  avatarUrl?: string | null;
  insight?: InsightState;
  onInsightRequest?: () => void;
};

/** Typing indicator (three dots) while waiting for the API response */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {["-0.32s", "-0.16s", "0s"].map((delay) => (
        <span
          key={delay}
          className="animate-typing-dots size-1.5 rounded-full bg-current"
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}

export function AnalysisBubbleRow({
  speakerName,
  content,
  role,
  avatarUrl,
  insight,
  onInsightRequest,
}: AnalysisBubbleRowProps) {
  const isUser = role === "user";
  const isActor = role === "actor";
  const initial = speakerName.charAt(0).toUpperCase();

  const showInsight =
    insight && (insight.hasContent || insight.isLoading || insight.isStreaming);

  return (
    <div
      className={cn(
        "font-body flex items-start gap-2",
        isUser && "flex-row-reverse",
      )}
    >
      {/* Avatar */}
      <Avatar size="lg" className="mt-6 shrink-0">
        <AvatarImage src={avatarUrl ?? "#"} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {initial}
        </AvatarFallback>
      </Avatar>

      {/* Name + bubble */}
      <div className="max-w-[70%] min-w-0">
        <div className="font-heading text-muted-foreground mb-1 flex items-center justify-between font-semibold">
          {speakerName}
          {/* Action button — outer edge of the row */}
          {onInsightRequest && (
            <div className="inline-block shrink-0 self-start">
              <Button
                size="sm"
                variant="link"
                className={cn(
                  "m-0 gap-1.5 rounded-full p-0 px-3 py-1.5 text-xs font-semibold transition-all",
                  isUser ? "order-first" : "",
                  isUser ? "text-primary" : "text-secondary",
                )}
                onClick={onInsightRequest}
                disabled={insight?.isLoading || insight?.hasContent}
              >
                {insight?.isLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : isUser ? (
                  <MessageSquare className="size-3" />
                ) : (
                  <Lightbulb className="size-3" />
                )}
                {isUser ? "Feedback" : "Better Response"}
              </Button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative rounded-md px-5 py-3 text-left wrap-break-word shadow-[0_2px_3px_0px_rgba(0,0,0,0.08)]",
            isActor
              ? "bg-muted text-foreground rounded-bl-[4px] bg-linear-to-br"
              : "bg-primary rounded-br-[4px] text-white",
          )}
        >
          {/* Original message */}
          <p className={cn(showInsight && "font-medium")}>{content}</p>

          {/* Streaming insight section */}
          <AnimatePresence>
            {showInsight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div
                  className={cn(
                    "mt-3 border-t pt-3",
                    isUser ? "border-white/20" : "border-black/10",
                  )}
                >
                  {insight.isLoading && !insight.hasContent ? (
                    <TypingDots />
                  ) : (
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        isUser ? "text-white/80" : "text-foreground/70",
                      )}
                    >
                      <span
                        className={cn(
                          "font-semibold",
                          isUser ? "text-white" : "text-secondary",
                        )}
                      >
                        {isUser ? "Feedback:" : "Better Response:"}
                      </span>{" "}
                      {insight.text}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
