"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/ui";
import { useActors } from "@/features/actor/presentation/hooks";
import type { ActorListItemResult } from "@/features/actor/application/dto";
import { useSearch } from "@/hooks/use-search";
import type { SelectActorModalProps } from "@/lib/modals/types";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

function actorMatchesQuery(actor: ActorListItemResult, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    actor.firstName,
    actor.lastName,
    `${actor.firstName} ${actor.lastName}`,
    actor.description ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export function SelectActorModal({
  onSelect,
  onCancel,
  ...props
}: SelectActorModalProps) {
  const { data: actors = [], isLoading: isLoadingActors } = useActors();
  const {
    results,
    search,
    query,
    isLoading: isSearching,
  } = useSearch({
    data: actors,
    filter: actorMatchesQuery,
    minQueryLength: 1,
  });

  const displayedActors = useMemo(() => {
    return query.trim().length >= 1 ? results : actors;
  }, [actors, query, results]);
  const [selectedActorId, setSelectedActorId] = useState<string | null>(
    props.selectedActorId ?? null,
  );
  function handleSelect(actorId: string | null) {
    if (!actorId) return;
    onSelect(actorId);
    onCancel?.();
  }

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Select Actor</DialogTitle>
        <DialogDescription>
          Search and choose who you want to practice with.
        </DialogDescription>
      </DialogHeader>

      <Input
        placeholder="Search actors..."
        value={query}
        onChange={(event) => search(event.target.value)}
        autoFocus
      />

      <div className="max-h-72 space-y-2 overflow-y-auto">
        {isLoadingActors || isSearching ? (
          <div className="flex-cc text-muted-foreground py-8">
            <Loader2 strokeWidth={2.5} className="size-5 animate-spin" />
          </div>
        ) : displayedActors.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            {query.trim().length >= 1
              ? "No actors match your search."
              : "No actors available."}
          </p>
        ) : (
          displayedActors.map((actor) => {
            const isSelected = actor.id === selectedActorId;
            const initials = actor.firstName.slice(0, 1).toUpperCase();

            return (
              <button
                key={actor.id}
                type="button"
                onClick={() => setSelectedActorId(actor.id)}
                className={cn(
                  "hover:bg-secondary/20 hover:border-secondary flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  isSelected && "border-secondary bg-secondary/10",
                )}
              >
                <Avatar className="size-10">
                  {actor.avatarUrl ? (
                    <AvatarImage src={actor.avatarUrl} alt={actor.firstName} />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {actor.firstName} {actor.lastName}
                  </p>
                  {actor.description ? (
                    <p className="text-muted-foreground line-clamp-1 text-sm">
                      {actor.description}
                    </p>
                  ) : null}
                </div>
                {isSelected ? (
                  <Check
                    strokeWidth={3.5}
                    className="text-secondary size-4.5"
                  />
                ) : null}
              </button>
            );
          })
        )}
      </div>

      <DialogFooter className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={!selectedActorId}
          variant="primary"
          onClick={() => handleSelect(selectedActorId)}
        >
          Done
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
