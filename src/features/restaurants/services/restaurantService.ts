import { supabase } from "@lib/supabase/client";
import type {
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../types/restaurant";

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*, cuisine_type:cuisine_types(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Restaurant> {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*, cuisine_type:cuisine_types(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(
    userId: string,
    input: CreateRestaurantInput
  ): Promise<Restaurant> {
    const { data, error } = await supabase
      .from("restaurants")
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: UpdateRestaurantInput): Promise<Restaurant> {
    const { data, error } = await supabase
      .from("restaurants")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

};
