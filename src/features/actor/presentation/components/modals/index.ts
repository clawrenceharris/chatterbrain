export { SelectActorModal } from "./select-actor-modal";

import { modalRegistry, ModalType } from "@/lib/modals";
import { SelectActorModal } from "./select-actor-modal";

export const ACTOR_MODAL_TYPES = {
  SELECT: "select-actor",
} as const satisfies Record<string, ModalType>;

export function registerActorModals() {
  modalRegistry.register(ACTOR_MODAL_TYPES.SELECT, SelectActorModal);
}
