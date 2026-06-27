"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { History, Loader2, Search } from "lucide-react";

import { SearchInput } from "@/components/form";
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSearchContext } from "@/features/search/presentation/components/providers";
import { SearchResultItem } from "@/features/search/domain/value-objects/SearchResultItem";
import { useSearchPage } from "@/features/search/presentation/hooks";
import { Button } from "../ui";

const MAX_PANEL_RESULTS = 6;

function HighlightedLabel({ label, query }: { label: string; query: string }) {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLabel = label.toLowerCase();
  const matchIndex = normalizedLabel.indexOf(normalizedQuery);

  if (!normalizedQuery || matchIndex === -1) {
    return <span className="font-semibold">{label}</span>;
  }

  const before = label.slice(0, matchIndex);
  const match = label.slice(matchIndex, matchIndex + normalizedQuery.length);
  const after = label.slice(matchIndex + normalizedQuery.length);

  return (
    <>
      {before ? <span className="font-semibold">{before}</span> : null}
      <span className="font-normal">{match}</span>
      {after ? <span className="font-semibold">{after}</span> : null}
    </>
  );
}

export function HeaderSearch() {
  const router = useRouter();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [panelWidth, setPanelWidth] = useState<number | undefined>();

  const { query: currentQuery } = useSearchContext();
  const [query, setQuery] = useState(currentQuery);
  const { data, isLoading, isFetching } = useSearchPage(query);
  const [hasSearched, setHasSearched] = useState(false);
  const trimmedQuery = query.trim();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelResults = data?.results.slice(0, MAX_PANEL_RESULTS) || [];
  const isSearching = isLoading || isFetching;
  const showPanel = expanded && !panelDismissed && hasSearched;
  useEffect(() => {
    setPanelDismissed(false);
  }, [trimmedQuery]);

  useLayoutEffect(() => {
    if (!expanded || !anchorRef.current) return;
    const updateWidth = () => {
      setPanelWidth(anchorRef.current?.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [expanded]);

  useEffect(() => {
    if (!currentQuery) setQuery("");
  }, [currentQuery]);

  function handleSelectSearchResult(result: SearchResultItem) {
    const params = new URLSearchParams({
      query: result.label,
      type: result.type,
    });
    setQuery(result.label);
    setExpanded(false);
    setPanelDismissed(true);
    router.push(`/search?${params.toString()}`);
  }
  function handleSearch(query: string) {
    setQuery(query);
    setExpanded(true);
    setPanelDismissed(false);
    setHasSearched(true);
  }
  function handleSubmitQuery() {
    if (trimmedQuery) {
      const params = new URLSearchParams({ query: trimmedQuery, type: "all" });
      setExpanded(false);
      setPanelDismissed(true);
      router.push(`/search?${params.toString()}`);
    } else {
      setPanelDismissed(true);
      setHasSearched(false);
      setQuery("");
      inputRef.current?.blur();
    }
  }
  return (
    <Popover
      open={showPanel}
      onOpenChange={(open) => {
        if (!open) setPanelDismissed(true);
      }}
      modal={false}
    >
      <PopoverAnchor asChild>
        <div ref={anchorRef} className="relative w-full">
          <SearchInput
            ref={inputRef}
            expanded={expanded}
            autoComplete="off"
            value={query}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitQuery();
              }
            }}
            onFocus={() => setExpanded(true)}
            placeholder="Search scenarios, actors or people"
            collapseOnOutsideClick={false}
            className="w-full max-w-xl border-transparent"
            inputClassName="text-base h-10 py-0"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={10}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className={cn(
          "border-border rounded-2xl p-0 shadow-md",
          "w-full max-w-[360px]",
        )}
        style={panelWidth ? { width: panelWidth } : undefined}
      >
        <ScrollArea className="max-h-72">
          <ItemGroup className="gap-0 p-1">
            {isSearching ? (
              <div className="text-muted-foreground flex items-center gap-2 px-4 py-4 text-sm">
                <Loader2 strokeWidth={2.5} className="size-4 animate-spin" />
                Searching…
              </div>
            ) : panelResults.length > 0 ? (
              panelResults.map((result) => (
                <Item
                  key={`${result.type}-${result.id}`}
                  asChild
                  size="xs"
                  className="hover:bg-muted/70 cursor-pointer rounded-xl border-0 px-3 py-3 shadow-none"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectSearchResult(result)}
                  >
                    <ItemMedia variant="icon" className="text-muted-foreground">
                      {result.type === "saved" ? (
                        <History className="size-4" strokeWidth={2.5} />
                      ) : (
                        <Search className="size-4" strokeWidth={2.5} />
                      )}
                    </ItemMedia>
                    <ItemContent>
                      <span className="text-foreground font-heading text-left text-base leading-none font-light">
                        <HighlightedLabel
                          label={result.label}
                          query={trimmedQuery}
                        />
                      </span>
                    </ItemContent>
                  </button>
                </Item>
              ))
            ) : (
              <div className="text-muted-foreground px-4 py-4 text-sm">
                No results came up for that search.
              </div>
            )}
          </ItemGroup>
        </ScrollArea>

        {trimmedQuery.length >= 1 && panelResults.length > 0 ? (
          <>
            <Separator />
            <div className="px-4 py-3">
              <Button
                variant="link"
                type="button"
                onClick={handleSubmitQuery}
                className="text-muted-foreground text-sm transition-colors hover:no-underline"
              >
                View all results
              </Button>
            </div>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
