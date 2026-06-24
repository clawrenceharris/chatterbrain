"use client";
import React, { forwardRef } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
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
  Input,
} from "../ui";
import { cn } from "@/lib/utils";
interface InputFieldProps<
  T extends FieldValues,
  U extends Path<T>,
> extends React.ComponentProps<"input"> {
  label: string;
  name: U;
  showsDescription?: boolean;
  description?: string;
  showsLabel?: boolean;
  renderInput?: ({
    field,
    fieldState,
  }: {
    field: ControllerRenderProps<T, U>;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
}
function InputFieldInner<T extends FieldValues, U extends Path<T>>(
  props: InputFieldProps<T, U>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    label,
    name,
    placeholder,
    showsDescription = true,
    description,
    required,
    showsLabel = true,
    renderInput,
    ...inputProps
  } = props;
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  return (
    <Field ref={ref}>
      <FieldContent>
        <FieldLabel
          className={!showsLabel ? "sr-only" : ""}
          htmlFor={field.name}
        >
          {label}{" "}
          {required && (
            <span className="text-primary font-bold">(required)</span>
          )}
        </FieldLabel>
        {description && (
          <FieldDescription
            className={cn(
              "text-xs leading-relaxed",
              !showsDescription && "sr-only",
            )}
          >
            {description}
          </FieldDescription>
        )}
      </FieldContent>

      {renderInput ? (
        renderInput({ field, fieldState })
      ) : (
        <Input
          {...field}
          {...inputProps}
          aria-required={required}
          id={field.name}
          placeholder={`${placeholder} ${!required ? "(Optional)" : ""}`}
          aria-invalid={fieldState.invalid}
        />
      )}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export const InputField = forwardRef(InputFieldInner) as <
  T extends FieldValues,
  U extends Path<T>,
>(
  props: InputFieldProps<T, U> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;
