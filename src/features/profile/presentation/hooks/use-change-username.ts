"use client";
import { useCallback, useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { ProfileCardResult } from "../../application/dto";
import { checkUsernameAction } from "@/actions/profile";

type UseChangeUsernameProps = {
  userId: string | null;
  form: UseFormReturn<any>;
  profile?: ProfileCardResult | null;
};
export const useChangeUsername = ({
  profile,
  userId,
  form,
}: UseChangeUsernameProps) => {
  const { control, clearErrors, setError } = form;
  const username = useWatch({ control, name: "username" });
  useEffect(() => {
    if (!username) return;
    form.clearErrors("username");
  }, [username, form]);
  const checkUsername = useCallback(async () => {
    if (!userId) return;

    const result = await checkUsernameAction(username, userId);
    if (result.success) {
      if (!result.data.isValid) {
        form.setError("username", { message: result.data.message });
        return false;
      }
      return true;
    } else {
      form.setError("username", { message: result.error.message });
      return false;
    }
  }, [form, userId, username]);
  useEffect(() => {
    if (!username) {
      return;
    }
    if (profile?.username === username) {
      return;
    }

    checkUsername();
  }, [
    username,
    profile?.username,
    userId,
    clearErrors,
    setError,
    form,
    checkUsername,
  ]);

  return { checkUsername };
};
