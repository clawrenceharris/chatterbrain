"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboardingAction } from "@/actions/onboarding";
import { profileKeys } from "@/lib/queries/keys";
import type { OnboardingFormValues } from "@/lib/validation/onboarding";
import type { CompleteOnboardingResult } from "@/features/onboarding/application/dto";

type UseCompleteOnboardingProps = {
  userId: string;
  onSuccess?: (result: CompleteOnboardingResult) => void;
  onError?: (message: string) => void;
};

export function useCompleteOnboarding({
  userId,
  onSuccess,
  onError,
}: UseCompleteOnboardingProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["completeOnboarding", userId],
    mutationFn: async (data: OnboardingFormValues) => {
      const result = await completeOnboardingAction({
        userId,
        birthday: data.birthday || null,
        gender: data.gender || null,
        goals: data.goals,
        interests: data.interests,
        dataConsentAccepted: data.dataConsentAccepted,
      });
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error.message);
    },
  });

  const completeOnboarding = useCallback(
    (data: OnboardingFormValues) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  return {
    completeOnboarding,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
