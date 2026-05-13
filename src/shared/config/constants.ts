export const APP_NAME = "MyFoodMap";

export const STORAGE_BUCKETS = {
  RESTAURANT_PHOTOS: "restaurant-photos",
} as const;

export const RATING_MIN = 1;
export const RATING_MAX = 5;

export const QUERY_KEYS = {
  restaurants: ["restaurants"] as const,
  restaurant: (id: string) => ["restaurants", id] as const,
  cuisines: ["cuisines"] as const,
  cuisine: (id: string) => ["cuisines", id] as const,
  profile: (id: string) => ["profile", id] as const,
} as const;

export const ADMIN_EMAILS: string[] = ["jdorado.cebrian@gmail.com"];
