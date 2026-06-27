import { EncounterCompletionModalProps } from "@/lib/modals/types";

export function EncounterCompletionModal({
  encounterId,
}: EncounterCompletionModalProps) {
  return (
    <div>
      <h1>Encounter Review</h1>
      <p>Encounter {encounterId}</p>
    </div>
  );
}
