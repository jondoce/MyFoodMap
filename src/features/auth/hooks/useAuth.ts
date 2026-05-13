import { useEffect, useState, useCallback } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { authService } from "../services/authService";
import { t } from "@shared/config/translations";

function translateAuthError(err: unknown): string {
  if (err instanceof AuthError) {
    switch (err.status) {
      case 400:
        if (err.message.includes("Invalid login credentials")) {
          return t.auth.invalidCredentials;
        }
        if (err.message.includes("User not found")) {
          return t.auth.userNotFound;
        }
        if (err.message.includes("Email not confirmed")) {
          return "Confirma tu correo antes de iniciar sesión";
        }
        return err.message;
      case 422:
        if (err.message.includes("Password")) {
          return t.auth.weakPassword;
        }
        if (err.message.includes("email")) {
          return t.auth.invalidEmail;
        }
        return err.message;
      default:
        break;
    }
  }
  
  const message = err instanceof Error ? err.message : "";
  if (message.includes("network") || message.includes("fetch")) {
    return t.auth.networkError;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return t.auth.signInFailed;
}

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    authService
      .getSession()
      .then((session) => {
        setState({ session, loading: false, error: null });
      })
      .catch((err: Error) => {
        setState({ session: null, loading: false, error: err.message });
      });

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ...prev, session, loading: false }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, error: null }));
      try {
        const result = await authService.signIn({ email, password });
        setState((prev) => ({ 
          ...prev, 
          session: result.session,
        }));
        return result;
      } catch (err) {
        const message = translateAuthError(err);
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      }
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      setState((prev) => ({ ...prev, error: null }));
      try {
        await authService.signUp({ email, password, displayName });
      } catch (err) {
        const message = translateAuthError(err);
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await authService.signOut();
    } catch (err) {
      const message = translateAuthError(err);
      setState((prev) => ({ ...prev, error: message }));
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (data: { displayName?: string; avatarUrl?: string }) => {
      setState((prev) => ({ ...prev, error: null }));
      try {
        const result = await authService.updateProfile(data);
        setState((prev) => ({
          ...prev,
          session: prev.session 
            ? { ...prev.session, user: result.user } 
            : null,
        }));
        return result;
      } catch (err) {
        const message = translateAuthError(err);
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      }
    },
    []
  );

  return {
    session: state.session,
    user: state.session?.user ?? null,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.session,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
