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
          className={cn(
            !showsLabel && "sr-only",
            "font-body text-lg font-bold",
          )}
          htmlFor={field.name}
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

      {renderInput ? (
        renderInput({ field, fieldState })
      ) : (
        <Input
          {...field}
          {...inputProps}
          aria-required={required}
          id={field.name}
          className="rounded-md py-7 font-normal"
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
