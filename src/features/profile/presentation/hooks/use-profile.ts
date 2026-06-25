"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, getProfileDetail } from "@/actions/profile";
import { profileKeys } from "@/lib/queries/keys";
import type { ProfileDetailResult } from "../../application/dto";

export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ""),

    queryFn: async () => {
      if (!userId) {
        throw new Error("userId is required to fetch profile.");
      }
      const result = await getProfile(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!userId,
  });
}

export function useProfileDetail(userId: string | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: profileKeys.detail(userId ?? "", "detail"),
    initialData: queryClient.getQueryData<ProfileDetailResult>(
      profileKeys.detail(userId ?? "", "detail"),
    ),
    queryFn: async () => {
      if (!userId) {
        throw new Error("userId is required to fetch profile.");
      }
      const result = await getProfileDetail(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!userId,
  });
}
