export { CreateProfileModal } from "./create-profile-modal";

import { modalRegistry, ModalType } from "@/lib/modals";
import { CreateProfileModal } from "./create-profile-modal";

/**
 * Modal type constants for profile modals
 */
export const PROFILE_MODAL_TYPES = {
  CREATE: "profile:create",
  UPDATE: "profile:update",
} as const satisfies Record<string, ModalType>;

/**
 * Register all profile modals with the modal registry
 * This should be called during app initialization
 */
export function registerProfileModals() {
  modalRegistry.register(PROFILE_MODAL_TYPES.CREATE, CreateProfileModal);
}
