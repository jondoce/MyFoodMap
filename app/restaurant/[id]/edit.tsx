import { Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  useRestaurant,
  useUpdateRestaurant,
} from "@features/restaurants/hooks/useRestaurants";
import { RestaurantForm } from "@features/restaurants/components/RestaurantForm";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { ErrorMessage } from "@shared/components/ErrorMessage";
import { t } from "@shared/config/translations";
import type { UpdateRestaurantInput } from "@features/restaurants/types/restaurant";

export default function EditRestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: restaurant, isLoading, error } = useRestaurant(id);
  const updateMutation = useUpdateRestaurant();

  if (isLoading) {
    return <LoadingSpinner message={t.restaurants.loading} />;
  }

  if (error || !restaurant) {
    return (
      <ErrorMessage
        message={
          error instanceof Error ? error.message : t.restaurants.notFound
        }
      />
    );
  }

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
    const input: UpdateRestaurantInput = {
      name: values.name,
      cuisine_type_id: values.cuisine_type_id,
      rating: values.rating,
      notes: values.notes || null,
      latitude: values.latitude,
      longitude: values.longitude,
      address: values.address,
      google_maps_url: values.google_maps_url,
    };

    try {
      await updateMutation.mutateAsync({ id: restaurant!.id, input });
      router.back();
    } catch (err) {
      Alert.alert(
        t.common.error,
        err instanceof Error ? err.message : t.restaurants.failedToUpdate
      );
    }
  }

  return (
    <RestaurantForm
      initialValues={{
        name: restaurant.name,
        cuisine_type_id: restaurant.cuisine_type_id,
        rating: restaurant.rating,
        notes: restaurant.notes ?? "",
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        address: restaurant.address ?? "",
        google_maps_url: restaurant.google_maps_url ?? "",
      }}
      onSubmit={handleSubmit}
      submitLabel={t.restaurants.updateRestaurant}
      loading={updateMutation.isPending}
    />
  );
}
