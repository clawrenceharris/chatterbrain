import { modalRegistry } from "@/lib/modals/registry";
import type { ModalType } from "@/lib/modals/types";
import { BadgeUnlockModal } from "./badge-unlock-modal";

export const GAMIFICATION_MODAL_TYPES = {
  BADGE_UNLOCK: "badge-unlock",
} as const satisfies Record<string, ModalType>;

export function registerGamificationModals() {
  modalRegistry.register(
    GAMIFICATION_MODAL_TYPES.BADGE_UNLOCK,
    BadgeUnlockModal,
  );
}

export * from "./badge-unlock-modal";
