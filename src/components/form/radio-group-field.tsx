"use client";

import React, { forwardRef } from "react";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
  RadioGroup,
  RadioGroupItem,
} from "../ui";
import { cn } from "@/lib/utils";
import type { OnboardingOption } from "@/features/onboarding/domain/types";

interface RadioGroupFieldProps<T extends FieldValues, U extends Path<T>> {
  label: string;
  name: U;
  options: OnboardingOption[];
  description?: string;
  showsDescription?: boolean;
  showsLabel?: boolean;
  required?: boolean;
  className?: string;
}

function RadioGroupFieldInner<T extends FieldValues, U extends Path<T>>(
  props: RadioGroupFieldProps<T, U>,
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

  return (
    <Field ref={ref} className={className}>
      <FieldContent>
        <FieldLabel
          className={cn(
            !showsLabel && "sr-only",
            "font-body text-lg font-bold",
          )}
        >
          {label}{" "}
          {required && (
            <span className="text-primary text-sm font-normal">(required)</span>
          )}
        </FieldLabel>
        {description && (
          <FieldDescription
            className={cn("text-sm", !showsDescription && "sr-only")}
          >
            {description}
          </FieldDescription>
        )}
      </FieldContent>

      <RadioGroup
        value={field.value ?? ""}
        onValueChange={field.onChange}
        aria-invalid={fieldState.invalid}
        className="gap-2"
      >
        {/* <FieldLabel htmlFor="kubernetes-r2h">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Kubernetes</FieldTitle>
                <FieldDescription>
                  Run GPU workloads on a K8s cluster.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="kubernetes" id="kubernetes-r2h" />
            </Field>
          </FieldLabel> */}
        {options.map((option) => (
          <FieldLabel
            key={option.id}
            htmlFor={`${field.name}-${option.id}`}
            className={cn(
              "cursor-pointer transition-colors",
              field.value === option.id &&
                "border-primary bg-primary/5 ring-primary/20 ring-1",
            )}
          >
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{option.label}</FieldTitle>
                {option.description && (
                  <FieldDescription>{option.description}</FieldDescription>
                )}
              </FieldContent>
              <RadioGroupItem
                checked={field.value === option.id}
                value={option.id}
                id={`${field.name}-${option.id}`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export const RadioGroupField = forwardRef(RadioGroupFieldInner) as <
  T extends FieldValues,
  U extends Path<T>,
>(
  props: RadioGroupFieldProps<T, U> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;
