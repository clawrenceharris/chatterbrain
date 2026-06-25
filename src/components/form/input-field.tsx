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

type FieldOrientation = "vertical" | "horizontal" | "responsive";

interface InputFieldProps<
  T extends FieldValues,
  U extends Path<T>,
> extends Omit<React.ComponentProps<"input">, "name"> {
  label: string;
  name: U;
  showsDescription?: boolean;
  description?: string;
  showsLabel?: boolean;
  orientation?: FieldOrientation;
  className?: string;
  inputId?: string;
  renderInput?: ({
    field,
    fieldState,
    inputId,
  }: {
    field: ControllerRenderProps<T, U>;
    fieldState: ControllerFieldState;
    inputId: string;
  }) => React.ReactNode;
}

function InputFieldInner<T extends FieldValues, U extends Path<T>>(
  props: InputFieldProps<T, U>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    label,
    name,
    placeholder,
    showsDescription = true,
    description,
    required,
    showsLabel = true,
    orientation = "vertical",
    inputId: inputIdProp,
    renderInput,
    ...inputProps
  } = props;
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const inputId = inputIdProp ?? field.name;

  return (
    <Field
      ref={ref}
      orientation={orientation}
      // className={cn(orientation === "responsive" && "@container/field-group")}
    >
      <FieldContent>
        <FieldLabel
          className={cn(
            !showsLabel && "sr-only",
            "font-body text-lg font-bold",
          )}
          htmlFor={inputId}
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
        renderInput({ field, fieldState, inputId })
      ) : (
        <Input
          {...field}
          {...inputProps}
          aria-required={required}
          id={inputId}
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
  props: InputFieldProps<T, U> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;
