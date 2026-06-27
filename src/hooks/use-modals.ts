"use client";
import { useModal } from "@/components/providers";
import {
  BadgeUnlockModalProps,
  ConfirmationModalProps,
  EncounterCompletionModalProps,
  PreviewScenarioModalProps,
  ScenarioOnboardingModalProps,
  SelectActorModalProps,
} from "@/lib/modals/types";
import { useMemo } from "react";

export function useModals() {
  const { openModal, closeModal } = useModal();

  const modals = useMemo(() => {
    return {
      ["confirmation"]: {
        open: (props: ConfirmationModalProps) => {
          openModal<ConfirmationModalProps>("confirmation", {
            ...props,
            isAlert: true,
            onCancel: closeModal,
          });
        },
      },
      ["encounter-onboarding"]: {
        open: (props: ScenarioOnboardingModalProps) => {
          openModal<ScenarioOnboardingModalProps>("encounter-onboarding", {
            ...props,
            isAlert: true,
            onCancel: props.onCancel || closeModal,
          });
        },
      },
      ["select-actor"]: {
        open: (props: SelectActorModalProps) => {
          openModal<SelectActorModalProps>("select-actor", {
            ...props,
            isAlert: false,
            onCancel: props.onCancel || closeModal,
          });
        },
      },
      ["encounter-complete"]: {
        open: (props: EncounterCompletionModalProps) => {
          openModal<EncounterCompletionModalProps>("encounter-complete", {
            ...props,
            onCancel: props.onCancel || closeModal,
          });
        },
      },
      ["preview-scenario"]: {
        open: (props: PreviewScenarioModalProps) => {
          openModal<PreviewScenarioModalProps>("preview-scenario", {
            ...props,
            onCancel: closeModal,
          });
        },
      },
      ["badge-unlock"]: {
        open: (props: BadgeUnlockModalProps) => {
          openModal<BadgeUnlockModalProps>("badge-unlock", {
            ...props,
            onCancel: props.onCancel || closeModal,
          });
        },
      },
    };
  }, [closeModal, openModal]);
  return { modals };
}
