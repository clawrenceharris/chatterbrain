export type OnboardingOption = {
  id: string;
  label: string;
  description?: string;
};

export type OnboardingTextField = {
  type: "text";
  fieldKey: string;
  label: string;
  placeholder?: string;
  required?: boolean;
};

export type OnboardingSingleChoiceField = {
  type: "single-choice";
  fieldKey: string;
  label: string;
  options: OnboardingOption[];
  required?: boolean;
};

export type OnboardingMultiChoiceField = {
  type: "multi-choice";
  fieldKey: string;
  label: string;
  options: OnboardingOption[];
  min?: number;
  max?: number;
  required?: boolean;
};

export type OnboardingConsentField = {
  type: "consent";
  fieldKey: string;
  label: string;
  required?: boolean;
};

export type OnboardingField =
  | OnboardingTextField
  | OnboardingSingleChoiceField
  | OnboardingMultiChoiceField
  | OnboardingConsentField;

export type OnboardingSlide = {
  id: string;
  title: string;
  description?: string;
  helperText?: string;
  skippable?: boolean;
  chitterSays: string;
  fields?: OnboardingField[];
};
