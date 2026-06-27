import type { ScenarioDetailTag } from "@/features/scenario/application/dto";
import { Briefcase, Leaf, Sparkles } from "lucide-react";
import { ScenarioTag } from "./scenario-tag";

type ScenarioHeaderTagsProps = {
  tags: ScenarioDetailTag[];
};

const tagIcons: Partial<Record<ScenarioDetailTag["variant"], React.ReactNode>> =
  {
    category: <Sparkles className="size-3.5" />,
    domain: <Briefcase className="size-3.5" />,
    difficulty: <Leaf className="size-3.5" />,
  };

export function ScenarioHeaderTags({ tags }: ScenarioHeaderTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <ScenarioTag
          key={`${tag.variant}-${tag.label}`}
          label={tag.label}
          variant={tag.variant}
          icon={tagIcons[tag.variant]}
        />
      ))}
    </div>
  );
}
