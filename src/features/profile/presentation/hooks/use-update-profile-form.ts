import { useCallback } from "react";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/lib/validation/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ProfileDetailResult,
  UpdateProfileResult,
} from "../../application/dto";
import { updateProfileAction } from "@/actions/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileKeys } from "@/lib/queries/keys";
import { useChangeUsername } from "./use-change-username";

type UseUpdateProfileFormProps = {
  onSuccess?: (result: UpdateProfileResult) => void;
  onError?: (error: string) => void;
  profile: ProfileDetailResult;
};
export const useUpdateProfileForm = ({
  onSuccess,
  onError,
  profile,
}: UseUpdateProfileFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      username: profile.username,
      avatarFile: null,
    },
  });
  const { checkUsername } = useChangeUsername({ userId: profile.userId, form });
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      const result = await updateProfileAction({
        displayName: data.displayName,
        username: data.username,
        avatarFile: data.avatarFile,
        userId: profile.userId,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error.message);
    },
  });
  const updateProfile = useCallback(
    async (data: UpdateProfileFormValues) => {
      const isUsernameAvailable = await checkUsername();
      if (!isUsernameAvailable) return;
      return await updateProfileMutation.mutateAsync(data);
    },
    [checkUsername, updateProfileMutation],
  );
  return {
    form,
    isLoading: updateProfileMutation.isPending,
    updateProfile,
  };
};
