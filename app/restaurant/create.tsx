import { Alert } from "react-native";
import { router } from "expo-router";
import { useCreateRestaurant } from "@features/restaurants/hooks/useRestaurants";
import { RestaurantForm } from "@features/restaurants/components/RestaurantForm";
import { t } from "@shared/config/translations";
import type { CreateRestaurantInput } from "@features/restaurants/types/restaurant";

export default function CreateRestaurantScreen() {
  const createMutation = useCreateRestaurant();

  async function handleSubmit(values: {
    name: string;
    cuisine_type_id: string | null;
    rating: number;
    notes: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    google_maps_url: string | null;
  }) {
    const input: CreateRestaurantInput = {
      name: values.name,
      dish: "",
      cuisine_type_id: values.cuisine_type_id,
      rating: values.rating,
      notes: values.notes || null,
      latitude: values.latitude,
      longitude: values.longitude,
      address: values.address,
      google_maps_url: values.google_maps_url,
      photo_url: null,
    };

    try {
      await createMutation.mutateAsync(input);
      router.back();
    } catch (err: any) {
      const errorMessage = err?.message ?? err?.error?.message ?? JSON.stringify(err) ?? t.restaurants.failedToCreate;
      Alert.alert(t.common.error, errorMessage);
      console.error("Restaurant create error:", err);
    }
  }

  return (
    <RestaurantForm
      onSubmit={handleSubmit}
      submitLabel={t.restaurants.saveRestaurant}
      loading={createMutation.isPending}
    />
  );
}
