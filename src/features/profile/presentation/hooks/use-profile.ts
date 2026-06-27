"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  getProfileDetail,
  getProfileDetailByUsername,
} from "@/actions/profile";
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

export function useProfileDetailByUsername(username: string | null) {
  return useQuery({
    queryKey: profileKeys.detailByUsername(username ?? ""),
    queryFn: async () => {
      if (!username) {
        throw new Error("Username is required to fetch profile.");
      }
      const result = await getProfileDetailByUsername(username);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!username,
  });
}
