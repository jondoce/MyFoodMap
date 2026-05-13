import type { CuisineType } from "@features/cuisines/types/cuisine";

export interface Restaurant {
  id: string;
  user_id: string;
  name: string;
  dish: string | null;
  cuisine_type_id: string | null;
  rating: number;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  google_maps_url: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  cuisine_type?: CuisineType;
}

export type CreateRestaurantInput = Omit<
  Restaurant,
  "id" | "user_id" | "created_at" | "updated_at" | "cuisine_type"
>;

export type UpdateRestaurantInput = Partial<CreateRestaurantInput>;
