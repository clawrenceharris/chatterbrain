import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import type { ChatMessage } from "@/features/encounter/domain/value-objects";

type MessageBubbleProps = {
  message: ChatMessage;
  isTargeting?: boolean;
  isSelected?: boolean;
  avatarUrl?: string | null;
  onSelect?: (message: ChatMessage) => void;
};

export function MessageBubble({
  message,
  isTargeting,
  isSelected,
  avatarUrl,
  onSelect,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isActor = message.role === "actor";
  const avatarInitial = message.speakerName?.charAt(0) ?? "";

  return (
    <div
      className={cn(
        "animate-message-slide-in font-body flex items-end gap-3",
        isUser && "flex-row-reverse",
      )}
    >
      <Avatar size="lg">
        <AvatarImage src={avatarUrl ?? "#"} />

        <AvatarFallback className={cn("bg-muted text-muted-foreground")}>
          {avatarInitial}
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[70%]">
        <div className="font-heading text-muted-foreground mb-1 font-semibold">
          {message.speakerName}
        </div>
        {isTargeting ? (
          <button
            disabled={!isTargeting}
            onClick={() => onSelect?.(message)}
            className={cn(
              "bg-card relative rounded-xl px-6 py-4 text-left wrap-break-word",
              isActor
                ? "text-foreground rounded-bl-[7px] bg-linear-to-br shadow-md"
                : "bg-primary rounded-br-[7px] text-white shadow-md",
              isTargeting &&
                "ring-accent ring-offset-background cursor-crosshair ring-2 ring-offset-2 transition-transform hover:scale-[1.01]",
              isSelected && "ring-primary ring-4",
              !isTargeting && "cursor-text disabled:opacity-100",
            )}
          >
            {message.content}
          </button>
        ) : (
          <div
            className={cn(
              "bg-card relative rounded-xl px-6 py-4 text-left wrap-break-word",
              isActor
                ? "text-foreground rounded-bl-[7px] bg-linear-to-br shadow-md"
                : "bg-primary rounded-br-[7px] text-white shadow-md",
            )}
          >
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
