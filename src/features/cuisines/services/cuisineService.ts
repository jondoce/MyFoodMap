import { supabase } from "@lib/supabase/client";
import type {
  CuisineType,
  CreateCuisineInput,
  UpdateCuisineInput,
} from "../types/cuisine";

export const cuisineService = {
  async getAll(): Promise<CuisineType[]> {
    const { data, error } = await supabase
      .from("cuisine_types")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<CuisineType> {
    const { data, error } = await supabase
      .from("cuisine_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: CreateCuisineInput): Promise<CuisineType> {
    const { data, error } = await supabase
      .from("cuisine_types")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: UpdateCuisineInput): Promise<CuisineType> {
    const { data, error } = await supabase
      .from("cuisine_types")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("cuisine_types")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
