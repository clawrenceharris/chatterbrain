export * from "./preview-scenario-modal";
import { modalRegistry } from "@/lib/modals/registry";
import { ModalType } from "@/lib/modals/types";
import { PreviewScenarioModal } from "./preview-scenario-modal";

export const MODAL_TYPES = {
  PREVIEW_SCENARIO: "preview-scenario",
} as const satisfies Record<string, ModalType>;

export function registerScenarioModals() {
  modalRegistry.register(MODAL_TYPES.PREVIEW_SCENARIO, PreviewScenarioModal);
}
