import { supabase } from "@lib/supabase/client";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<Profile, "display_name" | "avatar_url">>
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
