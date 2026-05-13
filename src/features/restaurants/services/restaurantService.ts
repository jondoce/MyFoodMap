import { supabase } from "@lib/supabase/client";
import { STORAGE_BUCKETS } from "@shared/config/constants";
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

  async uploadPhoto(
    userId: string,
    uri: string
  ): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `${userId}/${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.RESTAURANT_PHOTOS)
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(STORAGE_BUCKETS.RESTAURANT_PHOTOS)
      .getPublicUrl(fileName);

    return publicUrl;
  },
};
