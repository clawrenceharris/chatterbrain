"use client";

import {
  CheckboxField,
  InputField,
  MultiChoiceField,
  RadioGroupField,
} from "@/components/form";
import type { OnboardingField } from "@/features/onboarding/domain/types";
import type { OnboardingFormValues } from "@/lib/validation/onboarding";
import { FieldGroup } from "@/components/ui";
import type { Path } from "react-hook-form";

type OnboardingFieldRendererProps = {
  fields: OnboardingField[];
};

export function OnboardingFieldRenderer({
  fields,
}: OnboardingFieldRendererProps) {
  if (!fields.length) {
    return null;
  }

  return (
    <FieldGroup className="gap-5">
      {fields.map((field) => {
        const name = field.fieldKey as Path<OnboardingFormValues>;

        switch (field.type) {
          case "text":
            return (
              <InputField<OnboardingFormValues, typeof name>
                key={field.fieldKey}
                name={name}
                className="bg-surface border-muted-foreground/20 border-2"
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
              />
            );
          case "single-choice":
            return (
              <RadioGroupField<OnboardingFormValues, typeof name>
                key={field.fieldKey}
                name={name}
                label={field.label}
                options={field.options}
                required={field.required}
              />
            );
          case "multi-choice":
            return (
              <MultiChoiceField<OnboardingFormValues, typeof name>
                key={field.fieldKey}
                name={name}
                label={field.label}
                options={field.options}
                required={field.required}
                min={field.min}
                max={field.max}
              />
            );
          case "consent":
            return (
              <CheckboxField<OnboardingFormValues, typeof name>
                key={field.fieldKey}
                name={name}
                label={field.label}
                required={field.required}
              />
            );
          default:
            return null;
        }
      })}
    </FieldGroup>
  );
}
