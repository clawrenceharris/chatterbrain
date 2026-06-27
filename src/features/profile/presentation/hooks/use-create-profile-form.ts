"use client";
import {
  createProfileSchema,
  type CreateProfileFormValues,
} from "@/lib/validation/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { createProfileAction } from "@/actions/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/lib/queries/keys";
import type { CreateProfileResult } from "../../application/dto";
import { useChangeUsername } from "./use-change-username";

type UseCreateProfileFormProps = {
  onSuccess?: (result: CreateProfileResult) => void;
  onError?: (error: string) => void;
  userId: string;
};
export function useCreateProfileForm({
  userId,
  onSuccess,
  onError,
}: UseCreateProfileFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<CreateProfileFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      displayName: "",
      username: "",
      avatarFile: null,
    },
  });

  const createProfileMutation = useMutation({
    mutationKey: ["createProfile"],
    mutationFn: async (data: CreateProfileFormValues) => {
      const result = await createProfileAction({
        userId,
        displayName: data.displayName ?? null,
        username: data.username,
        avatarFile: data.avatarFile,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      onSuccess?.(data);
    },
    onError: (error) => {
      form.setError("root", { message: error.message });
      onError?.(error.message);
    },
  });
  const { checkUsername } = useChangeUsername({ userId, form });
  const createProfile = useCallback(
    async (data: CreateProfileFormValues) => {
      const isUsernameAvailable = await checkUsername();
      if (!isUsernameAvailable) return;
      return await createProfileMutation.mutateAsync(data);
    },
    [checkUsername, createProfileMutation],
  );
  return {
    form,
    isLoading: createProfileMutation.isPending,
    error: createProfileMutation.error,
    createProfile,
  };
}
