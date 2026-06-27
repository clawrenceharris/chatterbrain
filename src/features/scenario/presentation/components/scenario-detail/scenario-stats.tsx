import type { ScenarioDetailPageOutput } from "@/features/scenario/application/dto";
import {
  ScenarioLike,
  ScenarioSave,
} from "@/features/scenario/domain/value-objects";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

type ScenarioEncounterHistoryProps = {
  scenario: ScenarioDetailPageOutput;
  likes: ScenarioLike[];
  saves: ScenarioSave[];
};

export function ScenarioStats({
  scenario,
  likes = [],
  saves = [],
}: ScenarioEncounterHistoryProps) {
  const summaryItems = [
    {
      label: `${scenario.totalUserPlayCount === 1 ? "chatterbrain" : "chatterbrains"} practiced today`,
      value: scenario.totalUserPlayCount ?? 0,
      icon: <MessageCircle strokeWidth={3} className="size-4" />,
    },
    {
      label: "liked this scenario",
      value: likes.length ?? 0,
      icon: <Heart strokeWidth={3} className="size-4" />,
    },
    {
      label: `${saves.length === 1 ? "bookmark" : "bookmarks"}`,
      value: saves.length ?? 0,
      icon: <Bookmark strokeWidth={3} className="size-4" />,
    },
  ];

  return (
    <div className="flex w-full max-w-xl flex-wrap gap-x-6 gap-y-3">
      {summaryItems.map((item) => (
        <div
          key={item.label}
          className="text-secondary inline-flex items-center gap-2"
        >
          {item.icon}
          <p className="text-muted-foreground font-heading inline-flex items-center gap-1 text-sm font-semibold">
            <span>{item.value}</span>
            <span>{item.label}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
