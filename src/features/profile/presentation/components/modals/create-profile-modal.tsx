"use client";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import type { CreateProfileModalProps } from "@/lib/modals/types";
import { CreateProfileForm } from "../forms";

export function CreateProfileModal({
  onSuccess,
  userId,
}: CreateProfileModalProps) {
  return (
    <DialogContent showCloseButton={false} size="xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Create Profile</DialogTitle>
        <DialogDescription>
          Set up your new profile to personalize your experience and let others
          find you.
        </DialogDescription>
      </DialogHeader>
      <CreateProfileForm userId={userId} onSuccess={onSuccess} />
    </DialogContent>
  );
}
