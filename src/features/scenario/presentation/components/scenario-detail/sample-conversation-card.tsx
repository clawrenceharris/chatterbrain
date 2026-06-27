"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { ScenarioPreviewMessage } from "@/features/scenario/application/dto/ScenarioForPreivew";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { renderTemplate } from "@/shared/utils/renderTemplate";

type SampleConversationCardProps = {
  messages: ScenarioPreviewMessage[];
  actor: {
    displayName: string;
    avatarUrl: string | null;
  };
  user: {
    name: string;
    avatarUrl: string | null;
  };
};

export function SampleConversationCard({
  messages,
  actor,
  user,
}: SampleConversationCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (!messages.length) return null;

  const actorInitial = actor.displayName.charAt(0).toUpperCase();
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <Card ref={ref} className="overflow-hidden">
      <CardHeader className="border-b px-4">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
          <MessageCircle className="size-3.5" />
          Sample Conversation
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-4">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isUser ? 24 : -24 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: isUser ? 24 : -24 }
              }
              transition={{
                duration: 0.38,
                delay: i * 0.13,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={cn(
                "flex items-end gap-2",
                isUser && "flex-row-reverse",
              )}
            >
              {isUser ? (
                <Avatar size="sm" className="shrink-0">
                  <AvatarImage
                    src={user.avatarUrl ?? undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar size="sm" className="shrink-0">
                  <AvatarImage
                    src={actor.avatarUrl ?? undefined}
                    alt={actor.displayName}
                  />

                  <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-bold">
                    {actorInitial}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[78%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-xs",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-[4px]"
                    : "bg-card border-border text-foreground rounded-bl-[4px] border",
                )}
              >
                {renderTemplate(msg.content, {
                  actor_name: actor.displayName,
                  user_name: user.name,
                })}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
