import { View, Text, ScrollView, Pressable, Alert, Linking, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  useRestaurant,
  useDeleteRestaurant,
} from "@features/restaurants/hooks/useRestaurants";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { ErrorMessage } from "@shared/components/ErrorMessage";
import { Button } from "@shared/components/Button";
import { t } from "@shared/config/translations";
import { translateCuisine } from "@shared/config/cuisineTranslations";

const cuisineEmojis: Record<string, string> = {
  Italian: "🍝",
  Japanese: "🍣",
  Mexican: "🌮",
  Indian: "🍛",
  Chinese: "🥡",
  Thai: "🍜",
  French: "🥐",
  Spanish: "🥘",
  Korean: "🍲",
  Vietnamese: "🍲",
  Mediterranean: "🫒",
  American: "🍔",
  Brazilian: "🥩",
  Peruvian: "🐟",
  Ethiopian: "🫓",
  Turkish: "🥙",
  Lebanese: "🧆",
  Greek: "🥗",
  Caribbean: "🌴",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Text
          key={i}
          className={`text-xl ${i < rating ? "text-brand-400" : "text-cream-300/50"}`}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: restaurant,
    isLoading,
    error,
    refetch,
  } = useRestaurant(id);
  const deleteMutation = useDeleteRestaurant();

  if (isLoading) {
    return <LoadingSpinner message={t.restaurants.loading} />;
  }

  if (error || !restaurant) {
    return (
      <ErrorMessage
        message={
          error instanceof Error ? error.message : t.restaurants.notFound
        }
        onRetry={refetch}
      />
    );
  }

  const emoji = cuisineEmojis[restaurant.cuisine_type?.name ?? ""] ?? "🍴";

  function handleDelete() {
    if (!restaurant) return;

    Alert.alert(
      t.restaurants.deleteRestaurant,
      t.restaurants.deleteConfirm(restaurant.name),
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.common.delete,
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(restaurant.id);
              router.back();
            } catch (err) {
              Alert.alert(
                t.common.error,
                err instanceof Error
                  ? err.message
                  : t.restaurants.failedToDelete
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView className="flex-1 bg-bark-950">
      <View className="bg-gradient-to-b from-brand-600 to-brand-800 px-6 pt-12 pb-10">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white font-display leading-tight">
              {restaurant.name}
            </Text>
            <View className="flex-row items-center gap-2 mt-3">
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white/90 text-sm font-medium">
                  {translateCuisine(restaurant.cuisine_type?.name)}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => router.push(`/restaurant/${restaurant.id}/edit`)}
            className="bg-white/15 p-3 rounded-full"
          >
            <Text className="text-white text-xl">✏️</Text>
          </Pressable>
        </View>
        
        <View className="mt-6 flex-row items-center justify-between">
          <View>
            <RatingStars rating={restaurant.rating} />
          </View>
          {(restaurant.latitude || restaurant.google_maps_url) && Platform.OS !== "web" && (
            <Pressable
              className="bg-white/20 px-3 py-1.5 rounded-full flex-row items-center gap-1.5"
              onPress={() => {
                const url = restaurant.google_maps_url || 
                  (restaurant.latitude && restaurant.longitude 
                    ? `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`
                    : null);
                if (url) Linking.openURL(url);
              }}
            >
              <Text className="text-sm">🗺️</Text>
              <Text className="text-white font-medium text-sm">Mapa</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View className="px-5 -mt-4">
        {restaurant.notes && (
          <View className="bg-bark-900 rounded-2xl p-5 mt-4 border border-bark-800">
            <Text className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">
              📝 Notas
            </Text>
            <Text className="text-cream-200 leading-7 text-base font-serif">
              {restaurant.notes}
            </Text>
          </View>
        )}

        {(restaurant.address || restaurant.google_maps_url || restaurant.latitude) && (
          <View className="bg-bark-900 rounded-2xl p-5 mt-4 border border-bark-800">
            <Text className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">
              📍 Ubicación
            </Text>
            {restaurant.address && (
              <Text className="text-cream-300 text-base">
                {restaurant.address}
              </Text>
            )}
          </View>
        )}
      </View>

      <View className="px-5 mt-8 mb-12">
        <Button
          title={t.restaurants.deleteRestaurant}
          variant="danger"
          onPress={handleDelete}
          loading={deleteMutation.isPending}
        />
      </View>
    </ScrollView>
  );
}
