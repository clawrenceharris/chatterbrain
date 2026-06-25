"use client";

import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { ProfileAvatar } from "../ui";
import { cn } from "@/lib/utils";
import { InputField } from "@/components/form";
import { ProfileDetailResult } from "@/features/profile/application/dto";

type ProfileAvatarFieldProps<T extends FieldValues, U extends Path<T>> = {
  profile: ProfileDetailResult | null;
  showLabel?: boolean;
  showDescription?: boolean;
  className?: string;
  name: U;
  isLoading?: boolean;
} & React.ComponentProps<typeof ProfileAvatar>;

export function ProfileAvatarField<T extends FieldValues, U extends Path<T>>({
  profile,
  showLabel = true,
  showDescription = true,
  isLoading,
  className,
  name,
  ...props
}: ProfileAvatarFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const file = useWatch({ control, name });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function isFile(value: unknown): value is File {
    return (
      typeof File !== "undefined" && value instanceof File && value.size > 0
    );
  }

  useEffect(() => {
    if (!isFile(file)) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <InputField<T, U>
      name={name}
      label="Profile photo"
      showsLabel={showLabel}
      required={false}
      showsDescription={showDescription}
      orientation="responsive"
      className={cn(
        "@md/field-group:items-center @md/field-group:gap-6",
        className,
      )}
      description="Personalize your profile with a cool pic. (Optional)"
      renderInput={({ field, fieldState, inputId }) => (
        <div className="relative flex w-full shrink-0 justify-center @md/field-group:w-auto @md/field-group:justify-start">
          <label
            htmlFor={inputId}
            className="group shadow-primary/50 relative flex h-24 w-24 cursor-pointer justify-center rounded-full transition-all duration-300 hover:shadow-lg"
          >
            <ProfileAvatar
              profile={profile}
              previewUrl={previewUrl ?? profile?.avatarUrl}
              {...props}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center rounded-full",
                "bg-primary/80 opacity-0 transition-opacity group-hover:opacity-100",
                isLoading && "pointer-events-none bg-black/50 opacity-100",
              )}
            >
              {isLoading ? (
                <Loader2
                  strokeWidth={2.5}
                  className="size-8 animate-spin text-white"
                />
              ) : (
                <Pencil className="hidden size-8 text-white group-hover:block" />
              )}
            </div>
          </label>
          <input
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            id={inputId}
            type="file"
            accept="image/*"
            aria-invalid={fieldState.invalid}
            aria-required={false}
            className="sr-only"
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              field.onChange(next);
            }}
          />
          {previewUrl && (
            <Button
              type="button"
              className="bg-destructive/20 hover:bg-destructive/35 text-destructive absolute -top-2 right-0 z-10 shadow-md backdrop-blur-xs"
              variant="destructive"
              size="icon"
              onClick={() => field.onChange(null)}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      )}
    />
  );
}
