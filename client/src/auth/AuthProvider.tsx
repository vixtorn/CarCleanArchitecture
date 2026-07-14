import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  AuthContext,
  type AuthContextValue,
} from "./AuthContext";
import { supabase } from "../lib/supabaseClient";

interface AuthProviderProps {
  children: ReactNode;
}

async function signIn(
  email: string,
  password: string,
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error(
      "E-posta adresi ve parola zorunludur.",
    );
  }

  const { error } =
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

  if (error) {
    throw new Error(
      "E-posta adresi veya parola hatalı.",
    );
  }
}

async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(
      "Oturum kapatılamadı. Lütfen tekrar deneyin.",
    );
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (isCancelled) {
          return;
        }

        setSession(error ? null : data.session);
      })
      .catch(() => {
        if (!isCancelled) {
          setSession(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (isCancelled) {
          return;
        }

        setSession(nextSession);
        setIsAuthLoading(false);
      },
    );

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      isAuthLoading,
      signIn,
      signOut,
    }),
    [session, isAuthLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
