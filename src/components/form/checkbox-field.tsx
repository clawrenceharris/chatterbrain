"use client";

import React, { forwardRef } from "react";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps<T extends FieldValues, U extends Path<T>> {
  label: string;
  name: U;
  description?: string;
  showsDescription?: boolean;
  required?: boolean;
  className?: string;
}

function CheckboxFieldInner<T extends FieldValues, U extends Path<T>>(
  props: CheckboxFieldProps<T, U>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    label,
    name,
    description,
    showsDescription = true,
    required,
    className,
  } = props;
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });

  return (
    <Field
      ref={ref}
      orientation="horizontal"
      className={cn("items-start gap-3", className)}
    >
      <Checkbox
        id={field.name}
        checked={Boolean(field.value)}
        onCheckedChange={(checked: boolean) => field.onChange(checked === true)}
        aria-invalid={fieldState.invalid}
        aria-required={required}
      />
      <FieldContent>
        <FieldLabel
          htmlFor={field.name}
          className="font-body cursor-pointer text-base leading-snug font-normal"
        >
          {label}
        </FieldLabel>
        {description && (
          <FieldDescription
            className={cn("text-sm", !showsDescription && "sr-only")}
          >
            {description}
          </FieldDescription>
        )}
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>
    </Field>
  );
}

export const CheckboxField = forwardRef(CheckboxFieldInner) as <
  T extends FieldValues,
  U extends Path<T>,
>(
  props: CheckboxFieldProps<T, U> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;
