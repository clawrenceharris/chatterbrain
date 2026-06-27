"use client";
import React, { useEffect } from "react";
import { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/components/providers";
import { ErrorState, LoadingState } from "@/components/states";
import { useProfileDetail } from "@/features/profile/presentation/hooks";
import { Dialog } from "../ui";
import { CreateProfileModal } from "@/features/profile/presentation/components/modals";
import { ProfileDetailResult } from "@/features/profile/application/dto";

type UserContextType = {
  user: User;
  profile: ProfileDetailResult;
};
const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: React.ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isAuthRoute = pathname.startsWith("/auth");
  const {
    data: profile,
    refetch,
    isLoading: isLoadingProfile,
    error,
  } = useProfileDetail(user?.id ?? null);

  const needsOnboarding = Boolean(profile && !profile.onboardingCompletedAt);

  useEffect(() => {
    if (!profile || isLoadingProfile) return;

    if (needsOnboarding && !isOnboardingRoute) {
      router.replace("/onboarding");
      return;
    }

    if (!needsOnboarding && isOnboardingRoute) {
      router.replace("/home");
    }
  }, [profile, isLoadingProfile, needsOnboarding, isOnboardingRoute, router]);

  if (!isAuthReady) {
    return <LoadingState variant="page" />;
  }

  if (!user && !isAuthRoute) {
    return <LoadingState variant="page" />;
  }

  if (!user) {
    return (
      <div className="centered">
        <ErrorState
          title="Access Denied"
          message="You are not logged in. Please login to continue."
          onAction={() => router.push("/auth/login")}
          actionLabel="Login"
        />
      </div>
    );
  }

  if (isLoadingProfile) {
    return <LoadingState variant="page" />;
  }
  if (error) {
    return (
      <div className="centered">
        <ErrorState
          variant="card"
          title="Error loading profile"
          message={error.message}
          onAction={() => window.location.reload()}
          actionLabel="Refresh"
          onRetry={refetch}
        />
      </div>
    );
  }
  if (!profile) {
    return (
      <Dialog defaultOpen open>
        <CreateProfileModal
          userId={user.id}
          onSuccess={() => window.location.reload()}
        />
      </Dialog>
    );
  }

  if (needsOnboarding && !isOnboardingRoute) {
    return (
      <div className="centered">
        <LoadingState />
      </div>
    );
  }

  if (isOnboardingRoute) {
    return <>{children}</>;
  }

  return (
    <UserContext.Provider value={{ user, profile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
