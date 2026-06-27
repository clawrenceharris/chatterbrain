"use client";
import EncounterResultsPageClient from "./EncounterResultsPage";
import { useParams } from "next/navigation";

export default function EncounterResultsPage() {
  const { id } = useParams<{ id: string }>();

  return <EncounterResultsPageClient encounterId={id} />;
}
