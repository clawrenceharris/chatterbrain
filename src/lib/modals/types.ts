import { CreateProfileResult } from "@/features/profile/application/dto";

export interface ModalProps {
  [key: string]: unknown;
  onError?: (error: string) => void;
  onCancel?: () => void;
  isAlert?: boolean;
}

export type ModalType = "profile:create" | "profile:update";

export interface ModalState {
  type: ModalType | null;
  props: ModalProps | null;
}

export interface EncounterCompletionModalProps extends ModalProps {
  encounterId: string;
}

export interface ConfirmationModalProps extends ModalProps {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
}

export interface ScenarioOnboardingModalProps extends ModalProps {
  scenarioId: string;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
}

export interface SelectActorModalProps extends ModalProps {
  selectedActorId?: string;
  onSelect: (actorId: string) => void;
}

export interface CreateProfileModalProps extends ModalProps {
  userId: string;
  onSuccess: (result: CreateProfileResult) => void;
}
