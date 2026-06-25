"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, FieldError, Progress, ScrollArea } from "@/components/ui";
import { ChitterGuide } from "./chitter-guide";
import { OnboardingSlideShell } from "./onboarding-slide-shell";
import { OnboardingFieldRenderer } from "./onboarding-field-renderer";
import { useCompleteOnboarding, useOnboardingFlow } from "../hooks";
import type { OnboardingFormValues } from "@/lib/validation/onboarding";

type OnboardingFlowProps = {
  userId: string;
};

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { form, slides, totalSteps, validateCurrentStep } = useOnboardingFlow();
  const slide = slides[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  const { completeOnboarding, isLoading } = useCompleteOnboarding({
    userId,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: (message) => {
      form.setError("root", { message });
    },
  });

  const goBack = () => {
    form.clearErrors();
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const goNext = async (skipped = false) => {
    form.clearErrors("root");

    if (!skipped) {
      const isValid = await validateCurrentStep(currentStep);
      if (!isValid) return;
    } else {
      const fieldKeys = slide.fields?.map((field) => field.fieldKey) ?? [];
      for (const key of fieldKeys) {
        form.clearErrors(key as keyof OnboardingFormValues);
      }
    }

    if (isLastStep) {
      completeOnboarding(form.getValues());
      return;
    }

    setCurrentStep((step) => step + 1);
  };

  return (
    <FormProvider {...form}>
      <div className="flex h-full w-full flex-col gap-6 px-3">
        <Progress value={progressValue} className="h-2" />

        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-6">
            <OnboardingSlideShell slide={slide} onSkip={() => goNext(true)} />
            <div className="faded-col max-h-60 flex-1">
              <ScrollArea className="h-full min-h-0">
                <div className="flex h-full min-h-0 flex-col px-3 py-5">
                  <OnboardingFieldRenderer fields={slide.fields ?? []} />
                </div>
              </ScrollArea>
            </div>
            {form.formState.errors.root && (
              <FieldError className="text-destructive">
                {form.formState.errors.root.message}
              </FieldError>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={goBack}>
                  Back
                </Button>
              )}

              <Button
                type="button"
                variant="primary"
                className="flex-1"
                disabled={isLoading}
                onClick={() => goNext(false)}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isLastStep ? (
                  "Finish"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <ChitterGuide message={slide.chitterSays} />
          </div>
        </div>

        <div className="lg:hidden">
          <ChitterGuide message={slide.chitterSays} />
        </div>
      </div>
    </FormProvider>
  );
}
