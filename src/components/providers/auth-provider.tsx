"use client";
import { loginAction, signOutAction, signupAction } from "@/actions/auth";
import { supabase } from "@/lib/supabase/client";
import {
  type LoginFormValues,
  type SignUpFormValues,
} from "@/lib/validation/auth";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  /** False until the first `getSession()` finishes — avoids treating a cold-start null user as “logged out”. */
  isAuthReady: boolean;
  signup: (data: SignUpFormValues) => Promise<void>;
  login: (data: LoginFormValues) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  /**
   * `undefined` means the server did not resolve auth and the client should
   * fall back to `getSession()`. `null` means the server resolved no user.
   */
  initialUser?: User | null;
};

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const hasInitialAuthState = initialUser !== undefined;
  const [user, setUser] = useState<User | null>(() => initialUser ?? null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(hasInitialAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    if (!hasInitialAuthState) {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        setUser(session?.user ?? null);
        setIsAuthReady(true);
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [hasInitialAuthState]);

  /**
   * Sign up the user
   * @param data - The sign up data
   * @throws ApplicationError if the sign up fails
   */
  const signup = useCallback(
    async (data: SignUpFormValues) => {
      setIsLoading(true);
      const result = await signupAction(data);
      if (!result.success) {
        setIsLoading(false);
        throw result.error;
      }
      setUser(result.data);
      router.push("/home");
      router.refresh();
      setIsLoading(false);
    },
    [router],
  );

  /**
   * Login the user
   * @param data - The login data
   * @throws ApplicationError if the login fails
   */
  const login = useCallback(
    async (data: LoginFormValues) => {
      setIsLoading(true);
      const result = await loginAction(data);
      if (!result.success) {
        setIsLoading(false);
        throw result.error;
      }
      setUser(result.data);
      setIsLoading(false);
      router.push("/home");
      router.refresh();
    },
    [router],
  );

  /**
   * Sign out the user
   */
  const signOut = useCallback(async () => {
    setIsLoading(true);
    const result = await signOutAction();
    if (!result.success) {
      setIsLoading(false);
      toast.error(result.error.message);
    }
    router.push("/auth/login");
    router.refresh();
    setUser(null);
    setIsLoading(false);
  }, [router]);

  const value = {
    user,
    isAuthReady,
    signup,
    login,
    signOut,
    isLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
