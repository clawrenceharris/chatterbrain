"use client";

import { FormLayout, FormLayoutProps, InputField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import { UpdateProfileFormValues } from "@/lib/validation/profile";

export function UpdateProfileForm(
  props: FormLayoutProps<UpdateProfileFormValues>,
) {
  return (
    <FormLayout<UpdateProfileFormValues> showsCancelButton={false} {...props}>
      <FieldGroup>
        <InputField<UpdateProfileFormValues, "displayName">
          placeholder="What should we call you?"
          name="displayName"
          autoComplete="display-name"
          required={false}
          label="Display name"
        />
        <InputField<UpdateProfileFormValues, "username">
          placeholder="Last name"
          name="username"
          autoComplete="username"
          required
          label="Username"
        />
      </FieldGroup>
    </FormLayout>
  );
}
