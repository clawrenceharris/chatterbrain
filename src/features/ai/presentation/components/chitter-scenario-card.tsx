"use client";
import type { ChitterRecommendedScenario } from "../../application";
import Link from "next/link";

type ChitterScenarioCardProps = {
  recommendation: ChitterRecommendedScenario;
  onOpenScenario: (slug: string) => void;
};

export function ChitterScenarioCard({
  recommendation,
  onOpenScenario,
}: ChitterScenarioCardProps) {
  const { scenario, reason } = recommendation;

  return (
    <div className="w-full min-w-0 text-left shadow-none">
      <Link
        onClick={() => onOpenScenario(scenario.slug)}
        title={scenario.title}
        href={`/scenarios/${scenario.id}/${scenario.slug}`}
        className="text-primary line-clamp-2 text-base hover:underline"
      >
        {scenario.title}
      </Link>
      <p className="text-muted-foreground rounded-xl text-left text-sm">
        {reason}
      </p>
    </div>
  );
}
