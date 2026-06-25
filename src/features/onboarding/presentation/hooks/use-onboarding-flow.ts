"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildStepSchema,
  getSlideFieldKeys,
  onboardingDefaultValues,
  onboardingFormSchema,
  type OnboardingFormValues,
} from "@/lib/validation/onboarding";
import { ONBOARDING_SLIDES } from "@/features/onboarding/config";

export function useOnboardingFlow() {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: onboardingDefaultValues,
    mode: "onSubmit",
  });

  const validateCurrentStep = useCallback(
    async (stepIndex: number) => {
      const fieldKeys = getSlideFieldKeys(stepIndex);
      if (fieldKeys.length === 0) {
        return true;
      }

      const stepSchema = buildStepSchema(stepIndex);
      const values = form.getValues();
      const stepValues = Object.fromEntries(
        fieldKeys.map((key) => [key, values[key]]),
      );

      const result = stepSchema.safeParse(stepValues);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const fieldKey = issue.path[0];
          if (typeof fieldKey === "string") {
            form.setError(fieldKey as keyof OnboardingFormValues, {
              message: issue.message,
            });
          }
        }
        return false;
      }

      for (const key of fieldKeys) {
        form.clearErrors(key);
      }
      return true;
    },
    [form],
  );

  return {
    form,
    slides: ONBOARDING_SLIDES,
    totalSteps: ONBOARDING_SLIDES.length,
    validateCurrentStep,
  };
}
