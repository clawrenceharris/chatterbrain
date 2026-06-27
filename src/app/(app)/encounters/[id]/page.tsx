import React from "react";
import EncounterPageClient from "./EncounterPageClient";
import { EncounterProvider } from "@/features/encounter/presentation/providers";

type EncounterPageProps = {
  params: Promise<{ id: string }>;
};
export default function EncounterPage({ params }: EncounterPageProps) {
  const { id } = React.use(params);
  return (
    <EncounterProvider encounterId={id}>
      <EncounterPageClient />
    </EncounterProvider>
  );
}
