import {
  Button,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui";
import Image from "next/image";
import type {
  HelperAction,
  HelperPopoverState,
} from "@/features/encounter/domain/types";
import { X } from "lucide-react";
type HelperPopoverProps = {
  state: HelperPopoverState;
  onHelperActionClick: (action: HelperAction) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  onClose: () => void;
};

export function HelperPopover({
  state,
  align = "center",
  side = "top",
  onHelperActionClick,
  onClose,
}: HelperPopoverProps) {
  if (!state) return null;
  return (
    <PopoverContent
      align={align}
      side={side}
      className="relative mx-auto w-full max-w-[calc(60vw-4rem)] px-8 pt-12 pb-6"
    >
      <Image
        src={state.helper.icon}
        alt={state.helper.label}
        width={300}
        draggable={false}
        height={300}
        className="absolute -top-10 -left-10 size-26 -rotate-12 rounded-full select-none"
      />
      <PopoverHeader>
        <div className="flex flex-col gap-2">
          <PopoverTitle className="text-2xl">{state.helper.label}</PopoverTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => onClose()}
          >
            <X strokeWidth={3} />
          </Button>
        </div>
        {state.content.description ? (
          <PopoverDescription>{state.content.description}</PopoverDescription>
        ) : null}
      </PopoverHeader>

      <p>{state.content.body}</p>

      {state.content.suggestions?.length ? (
        <div className="grid max-w-[380px] grid-cols-1 gap-2">
          {state.content.suggestions?.map((suggestion) => (
            <p
              key={suggestion}
              className="bg-muted/40 flex items-center rounded-md border px-3 py-1"
            >
              {suggestion}
            </p>
          ))}
        </div>
      ) : null}
      {state.helper.payload.actions?.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-2">
          {state.helper.payload.actions?.map((action) => (
            <button
              key={action.text}
              className="bg-muted max-w-[380px] cursor-pointer rounded-2xl border px-3 py-2 text-left text-wrap"
              onClick={() => onHelperActionClick(action)}
            >
              <p>{action.text}</p>
            </button>
          ))}
        </div>
      ) : null}
    </PopoverContent>
  );
}
