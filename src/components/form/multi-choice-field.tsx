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
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui";
import { cn } from "@/lib/utils";
import type { OnboardingOption } from "@/features/onboarding/domain/types";

interface MultiChoiceFieldProps<T extends FieldValues, U extends Path<T>> {
  label: string;
  name: U;
  options: OnboardingOption[];
  description?: string;
  showsDescription?: boolean;
  showsLabel?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

function MultiChoiceFieldInner<T extends FieldValues, U extends Path<T>>(
  props: MultiChoiceFieldProps<T, U>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    label,
    name,
    options,
    description,
    showsDescription = true,
    showsLabel = true,
    required,
    className,
  } = props;
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  function toggle(id: string, checked: boolean) {
    const next = checked
      ? [...field.value, id]
      : field.value.filter((v: string) => v !== id);
    field.onChange(next);
  }
  return (
    <FieldSet
      className={className}
      data-invalid={fieldState.invalid || undefined}
    >
      <FieldLegend
        className={cn(!showsLabel && "sr-only", "font-body text-lg! font-bold")}
        variant="label"
      >
        {label}{" "}
        <span className="text-primary text-sm font-normal">
          (Select all that apply)
        </span>
      </FieldLegend>
      {description && (
        <FieldDescription
          className={cn("text-sm", !showsDescription && "sr-only")}
        >
          {description}
        </FieldDescription>
      )}
      <FieldGroup>
        {options.map((option) => {
          const checked = field.value.includes(option.id);
          return (
            <FieldLabel
              className={cn(
                "cursor-pointer transition-colors",
                checked && "border-primary bg-primary/5 ring-primary/20 ring-1",
              )}
              key={option.id}
              htmlFor={option.id}
            >
              <Field
                ref={ref}
                orientation="horizontal"
                data-invalid={fieldState.invalid || undefined}
              >
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                  <FieldDescription>{option.description}</FieldDescription>
                </FieldContent>
                <Checkbox
                  id={option.id}
                  checked={checked}
                  aria-required={required}
                  onCheckedChange={(value) => toggle(option.id, value === true)}
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid || undefined}
                />
              </Field>
            </FieldLabel>
          );
        })}
      </FieldGroup>
      {fieldState.error ? (
        <FieldError>{fieldState.error.message}</FieldError>
      ) : null}
    </FieldSet>
  );
}

export const MultiChoiceField = forwardRef(MultiChoiceFieldInner) as <
  T extends FieldValues,
  U extends Path<T>,
>(
  props: MultiChoiceFieldProps<T, U> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;
