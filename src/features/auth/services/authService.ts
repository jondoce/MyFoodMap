import { supabase } from "@lib/supabase/client";

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export const authService = {
  async signUp({ email, password, displayName }: SignUpParams) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn({ email, password }: SignInParams) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange(
    callback: (event: string, session: import("@supabase/supabase-js").Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async updateProfile({ displayName, avatarUrl }: { displayName?: string; avatarUrl?: string }) {
    const updates: Record<string, string> = {};
    if (displayName) updates.display_name = displayName;
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) throw error;
    return data;
  },
};
