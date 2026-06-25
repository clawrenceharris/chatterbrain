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
      showsCancelButton={false}
      onCancel={() => createProfile(getValues())}
      onSubmit={createProfile}
    >
      <ProfileAvatarField<CreateProfileFormValues, "avatarFile">
        profile={null}
        name="avatarFile"
      />
      <FieldGroup>
        <InputField<CreateProfileFormValues, "firstName">
          placeholder="Enter your first name"
          name="firstName"
          required
          label="What's your first name?"
        />
        <InputField<CreateProfileFormValues, "lastName">
          placeholder="Enter your last name"
          name="lastName"
          required={false}
          label="Last name"
        />
      </FieldGroup>
    </FormLayout>
  );
}
