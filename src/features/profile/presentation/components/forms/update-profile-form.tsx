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
        <InputField<UpdateProfileFormValues, "firstName">
          placeholder="First name"
          name="firstName"
          required={false}
          label="First name"
        />
        <InputField<UpdateProfileFormValues, "lastName">
          placeholder="Last name"
          name="lastName"
          required
          label="Last name"
        />
      </FieldGroup>
    </FormLayout>
  );
}
