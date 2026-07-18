import { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useRestaurants } from "@features/restaurants/hooks/useRestaurants";
import { useAuth } from "@features/auth/hooks/useAuth";
import { ADMIN_EMAILS } from "@shared/config/constants";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { ErrorMessage } from "@shared/components/ErrorMessage";
import { EmptyState } from "@shared/components/EmptyState";
import { t } from "@shared/config/translations";
import { translateCuisine } from "@shared/config/cuisineTranslations";
import type { Restaurant } from "@features/restaurants/types/restaurant";

function RatingStars({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Text
          key={i}
          className={`text-sm ${i < rating ? "text-brand-500" : "text-cream-300 dark:text-bark-600"}`}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function RestaurantCard({ item }: { item: Restaurant }) {
  return (
    <Link href={`/restaurant/${item.id}`} asChild>
      <Pressable
        className="mx-4 py-3 flex-row items-center border-b border-cream-200 dark:border-bark-800"
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View className="flex-1">
          <Text className="text-lg font-semibold text-bark-900 dark:text-cream-100">
            {item.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <RatingStars rating={item.rating} />
            <Text className="text-sm text-bark-400 dark:text-cream-500">
              · {translateCuisine(item.cuisine_type?.name)}
            </Text>
          </View>
        </View>
        <Text className="text-xl text-bark-300 dark:text-bark-500">›</Text>
      </Pressable>
    </Link>
  );
}

export default function RestaurantsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  useEffect(() => {
    if (isAdmin) {
      router.replace("/(tabs)/admin");
    }
  }, [isAdmin, router]);

  const { data: restaurants, isLoading, error, refetch } = useRestaurants();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisineId, setSelectedCuisineId] = useState<string | null>(null);

  const uniqueCuisines = useMemo(() => {
    if (!restaurants) return [];
    const ids = new Set<string>();
    const names = new Set<string>();
    restaurants.forEach(r => {
      if (r.cuisine_type_id && r.cuisine_type?.name && !ids.has(r.cuisine_type_id)) {
        ids.add(r.cuisine_type_id);
        names.add(translateCuisine(r.cuisine_type.name));
      }
    });
    return [{ id: null, name: "Todos" }, ...Array.from(names).sort().map(name => ({ id: name, name }))];
  }, [restaurants]);

  const filteredAndSorted = useMemo(() => {
    if (!restaurants) return [];
    let filtered = [...restaurants];
    if (selectedCuisineId) {
      filtered = filtered.filter(r => translateCuisine(r.cuisine_type?.name) === selectedCuisineId);
    }
    if (searchQuery.length >= 4) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => r.name.toLowerCase().includes(query));
    }
    return filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.name.localeCompare(b.name, "es");
    });
  }, [restaurants, searchQuery, selectedCuisineId]);

  if (isLoading) return <LoadingSpinner message={t.restaurants.loadingList} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : t.restaurants.failedToLoad} onRetry={refetch} />;
  if (!restaurants || restaurants.length === 0) return <EmptyState title={t.restaurants.noRestaurants} description={t.restaurants.noRestaurantsDesc} actionLabel={t.restaurants.addFirst} onAction={() => router.push("/restaurant/create")} emoji="🗺️" />;

  const selectedName = uniqueCuisines.find(c => c.id === selectedCuisineId)?.name ?? "Todos";

  return (
    <View className="flex-1 bg-cream-100 dark:bg-bark-900">
      <View className="px-4 pt-4">
        <TextInput
          className="bg-white dark:bg-bark-800 px-4 py-2.5 rounded-xl text-bark-900 dark:text-cream-100 mb-3"
          placeholder="Buscar restaurante..."
          placeholderTextColor="#9C8B7E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {uniqueCuisines.map(c => (
            <Pressable
              key={c.id ?? "all"}
              onPress={() => setSelectedCuisineId(c.id === selectedName ? null : c.id)}
              className={`px-3 py-1.5 rounded-full mr-2 ${
                selectedCuisineId === (c.id === selectedName ? null : c.id)
                  ? "bg-brand-500" 
                  : "bg-cream-200 dark:bg-bark-800"
              }`}
            >
              <Text className={`text-sm font-medium ${
                selectedCuisineId === (c.id === selectedName ? null : c.id)
                  ? "text-white" 
                  : "text-bark-700 dark:text-cream-300"
              }`}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text className="text-sm font-medium text-bark-400 dark:text-cream-500 pb-2">
          {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "restaurante" : "restaurantes"}
        </Text>
      </View>
      <ScrollView className="flex-1">
        {filteredAndSorted.map(item => <RestaurantCard key={item.id} item={item} />)}
      </ScrollView>
      <Link href="/restaurant/create" asChild>
        <Pressable
          className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-brand-500 items-center justify-center"
          style={({ pressed }) => ({
            transform: pressed ? [{ scale: 0.9 }] : [{ scale: 1 }],
            shadowColor: "#EE7A24",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          })}
        >
          <Text className="text-white text-2xl font-light">+</Text>
        </Pressable>
      </Link>
    </View>
  );
}