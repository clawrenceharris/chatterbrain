"use client";
import { FormLayout, InputField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import type { CreateProfileFormValues } from "@/lib/validation/profile";
import { useCreateProfileForm } from "../../hooks";
import type { CreateProfileResult } from "../../../application/dto";
import { ProfileAvatarField } from "./profile-avatar-field";

type CreateProfileFormProps = {
  onSuccess?: (result: CreateProfileResult) => void;
  userId: string;
};

export function CreateProfileForm({
  onSuccess,
  userId,
}: CreateProfileFormProps) {
  const { form, isLoading, createProfile } = useCreateProfileForm({
    userId,
    onSuccess,
  });
  const { getValues } = form;

  return (
    <FormLayout<CreateProfileFormValues>
      isLoading={isLoading}
      form={form}
      enableBeforeUnloadProtection={false}
      isDialog
      id="create-profile-form"
      showsCancelButton={false}
      onCancel={() => createProfile(getValues())}
      onSubmit={createProfile}
    >
      <ProfileAvatarField<CreateProfileFormValues, "avatarFile">
        profile={null}
        name="avatarFile"
      />
      <FieldGroup>
        <InputField<CreateProfileFormValues, "displayName">
          placeholder="What should we call you?"
          name="displayName"
          required={false}
          inputId="create-profile-form-display-name"
          label="Display name"
          autoComplete="given-name"
        />
        <InputField<CreateProfileFormValues, "username">
          placeholder="Choose a username"
          name="username"
          autoComplete="username"
          required
          inputId="create-profile-form-username"
          label="Username"
        />
      </FieldGroup>
    </FormLayout>
  );
}
