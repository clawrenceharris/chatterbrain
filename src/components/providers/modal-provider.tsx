"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AlertDialog, Dialog } from "@/components/ui";
import { ModalProps, modalRegistry, ModalState, ModalType } from "@/lib/modals";
import { ConfirmationModal } from "@/components/shared";
import { registerEncounterModals } from "@/features/encounter/presentation/components/modals";
import { registerActorModals } from "@/features/actor/presentation/components/modals";
import { registerScenarioModals } from "@/features/scenario/presentation/components/modals";
import { registerProfileModals } from "@/features/profile/presentation/components/modals";
import { registerGamificationModals } from "@/features/gamification/presentation/components/modals";
import { usePathname } from "next/navigation";
interface ModalContextType {
  openModal: <T extends ModalProps>(type: ModalType, props: T) => void;
  closeModal: () => void;
  isOpen: boolean;
  currentModalType: ModalType | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    props: null,
  });
  const pathname = usePathname();

  const closeModal = useCallback(() => {
    setModalState({ type: null, props: null });
  }, []);

  const openModal = useCallback(
    <T extends ModalProps>(type: ModalType, props: T) => {
      if (!modalRegistry.has(type)) {
        return;
      }

      setModalState({ type, props });
    },
    [],
  );
  useEffect(() => {
    closeModal();
  }, [closeModal, pathname]);
  // Render the modal component
  const modalContent =
    modalState.type && modalState.props
      ? (() => {
          const Component = modalRegistry.getComponent(modalState.type);
          if (!Component) {
            console.error(
              `No component found for modal type: ${modalState.type}`,
            );
            return null;
          }
          // Modal components render DialogContent which includes DialogPortal,
          // so we need to wrap in Dialog root
          return modalState.props.isAlert ? (
            <AlertDialog open={true} onOpenChange={closeModal}>
              <Component {...modalState.props} />
            </AlertDialog>
          ) : (
            <Dialog open={true} onOpenChange={closeModal}>
              <Component {...modalState.props} />
            </Dialog>
          );
        })()
      : null;

  const modal = modalState.type && modalContent ? modalContent : null;
  const value = useMemo<ModalContextType>(
    () => ({
      openModal,
      closeModal,
      modal,
      isOpen: modalState.type !== null,
      currentModalType: modalState.type,
    }),
    [openModal, closeModal, modal, modalState.type],
  );
  return (
    <ModalContext.Provider value={value}>
      {children}
      {modal}
      <ModalRegistration />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}

/**
 * Component that registers all modals on mount
 * Should be placed inside ModalProvider
 */
export function ModalRegistration() {
  useEffect(() => {
    modalRegistry.register("confirmation", ConfirmationModal);
    registerEncounterModals();
    registerScenarioModals();
    registerActorModals();
    registerProfileModals();
    registerGamificationModals();
  }, []);

  return null;
}
