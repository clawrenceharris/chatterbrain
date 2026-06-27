export * from "./encounter-completion-modal";
import { modalRegistry } from "@/lib/modals/registry";
import { ModalType } from "@/lib/modals/types";
import { EncounterCompletionModal } from "./encounter-completion-modal";
import { EncounterOnboardingModal } from "./encounter-onboarding-modal";

export const MODAL_TYPES = {
  ENCOUNTER_ONBOARDING: "encounter-onboarding",
  ENCOUNTER_COMPLETE: "encounter-complete",
} as const satisfies Record<string, ModalType>;

export function registerEncounterModals() {
  modalRegistry.register(
    MODAL_TYPES.ENCOUNTER_COMPLETE,
    EncounterCompletionModal,
  );
  modalRegistry.register(
    MODAL_TYPES.ENCOUNTER_ONBOARDING,
    EncounterOnboardingModal,
  );
}
