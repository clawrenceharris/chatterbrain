"use client";

import { useAuth } from "@/components/providers";
import { LoadingState } from "@/components/states";
import { OnboardingFlow } from "@/features/onboarding/presentation/components";

export default function OnboardingPage() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady || !user) {
    return <LoadingState />;
  }

  return (
    <div className="page to-primary from-secondary bg-surface p-0">
      <main className="flex min-h-dvh flex-col md:flex-row">
        <div className="flex min-h-dvh w-full flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-2xl">
            <OnboardingFlow userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
