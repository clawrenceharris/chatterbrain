import React from "react";
import ScenarioPageClient from "./ScenarioPageClient";

type ScenarioPageProps = {
  params: Promise<{ id: string }>;
};

export default function ScenarioPage({ params }: ScenarioPageProps) {
  const { id } = React.use(params);
  return <ScenarioPageClient scenarioId={id} />;
}
