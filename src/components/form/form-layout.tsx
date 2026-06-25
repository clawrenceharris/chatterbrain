"use client";
import { type ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import {
  Button,
  DialogFooter,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/components/ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BeforeUnload } from "@/components/form";
import { normalizeError } from "@/shared/utils";

export interface FormLayoutProps<T extends FieldValues> {
  children?: ((methods: UseFormReturn<T>) => ReactNode) | ReactNode;
  showsSubmitButton?: boolean;
  showsCancelButton?: boolean;
  submitText?: string;
  cancelText?: string;
  title?: string;
  showsTitle?: boolean;
  titleClassName?: string;
  onSubmit: (data: T) => Promise<any> | any;
  onCancel?: () => void;
  disabled?: boolean;
  description?: string;
  descriptionClassName?: string;
  enableBeforeUnloadProtection?: boolean;
  submitButtonClassName?: string;
  className?: string;
  showsDescription?: boolean;
  isDialog?: boolean;
  id?: string;
  isLoading?: boolean;
  form: UseFormReturn<T>;
}
type FormFooterProps = {
  showsCancelButton?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  showsSubmitButton?: boolean;
  submitButtonClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
};
function FormFooter({
  showsCancelButton,
  submitText,
  onCancel,
  cancelText,
  showsSubmitButton,
  submitButtonClassName,
  isLoading,
  disabled,
}: FormFooterProps) {
  return (
    <Field orientation="horizontal">
      {showsCancelButton && (
        <Button variant="outline" type="button" onClick={onCancel}>
          {cancelText}
        </Button>
      )}

      {showsSubmitButton && (
        <Button
          variant="primary"
          type="submit"
          className={cn("flex-1", submitButtonClassName)}
          disabled={disabled}
        >
          {isLoading ? (
            <Loader2 strokeWidth={2.5} className="animate-spin" />
          ) : (
            submitText
          )}
        </Button>
      )}
    </Field>
  );
}

export function FormLayout<T extends FieldValues>({
  children,
  showsSubmitButton = true,
  showsCancelButton = false,
  submitText = "Done",
  cancelText = "Cancel",
  title,
  titleClassName,
  showsTitle = true,
  onSubmit,
  onCancel,
  showsDescription = true,
  className,
  submitButtonClassName,
  description,
  descriptionClassName,
  enableBeforeUnloadProtection = true,
  id,
  form,
  isLoading,
  isDialog,
  ...props
}: FormLayoutProps<T>) {
  const {
    clearErrors,
    setError,
    formState: { errors, disabled, isSubmitting, isDirty },
  } = form;
  const handleSubmit = async (data: T) => {
    try {
      clearErrors();
      return await onSubmit(data);
    } catch (error) {
      setError("root", { message: normalizeError(error).message });
    }
  };
  return (
    <BeforeUnload disabled={!isDirty || !enableBeforeUnloadProtection}>
      <FormProvider {...form}>
        <form
          id={id}
          onSubmit={form.handleSubmit(handleSubmit)}
          className={className}
          aria-describedby={description}
        >
          <FieldGroup>
            <FieldContent className="space-y-3">
              {title && (
                <FieldTitle
                  className={cn(
                    "font-heading text-3xl font-bold",
                    !showsTitle ? "sr-only" : "",
                    titleClassName,
                  )}
                >
                  {title}
                </FieldTitle>
              )}
              {description && showsDescription && (
                <FieldDescription className={descriptionClassName}>
                  {description}
                </FieldDescription>
              )}
            </FieldContent>
            {typeof children === "function" ? children(form) : children}

            {/* General Error */}

            {errors.root && (
              <FieldError className="text-destructive">
                {errors.root.message}
              </FieldError>
            )}

            {isDialog ? (
              <DialogFooter>
                <FormFooter
                  showsCancelButton={showsCancelButton}
                  submitText={submitText}
                  onCancel={onCancel}
                  cancelText={cancelText}
                  showsSubmitButton={showsSubmitButton}
                  submitButtonClassName={submitButtonClassName}
                  isLoading={isLoading || isSubmitting}
                  disabled={
                    props.disabled || disabled || isLoading || isSubmitting
                  }
                />
              </DialogFooter>
            ) : (
              <FormFooter
                showsCancelButton={showsCancelButton}
                submitText={submitText}
                onCancel={onCancel}
                cancelText={cancelText}
                showsSubmitButton={showsSubmitButton}
                submitButtonClassName={submitButtonClassName}
                isLoading={isLoading || isSubmitting}
                disabled={
                  props.disabled || disabled || isLoading || isSubmitting
                }
              />
            )}
          </FieldGroup>
        </form>
      </FormProvider>
    </BeforeUnload>
  );
}
