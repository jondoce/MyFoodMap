import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useCurrentLocation } from "@features/location/hooks/useCurrentLocation";
import { useCuisines } from "@features/cuisines/hooks/useCuisines";
import { Input } from "@shared/components/Input";
import { Select, type SelectOption } from "@shared/components/Select";
import { Button } from "@shared/components/Button";
import { RATING_MIN, RATING_MAX } from "@shared/config/constants";
import { t } from "@shared/config/translations";
import { translateCuisine } from "@shared/config/cuisineTranslations";
import { parseGoogleMapsUrl } from "@lib/googleMaps";

function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-3 tracking-wide">
        {t.restaurants.rating}
      </Text>
      <View className="flex-row gap-2">
        {Array.from({ length: RATING_MAX }, (_, i) => i + 1).map((star) => (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            style={({ pressed }) => ({
              transform: pressed ? [{ scale: 1.2 }] : [{ scale: 1 }],
            })}
          >
            <Text
              className={`text-4xl ${
                star <= value
                  ? "text-brand-500"
                  : "text-cream-300 dark:text-bark-600"
              }`}
            >
              ★
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

interface RestaurantFormValues {
  name: string;
  cuisine_type_id: string | null;
  rating: number;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  google_maps_url: string | null;
}

interface RestaurantFormProps {
  initialValues?: Partial<RestaurantFormValues>;
  onSubmit: (values: RestaurantFormValues) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export function RestaurantForm({
  initialValues,
  onSubmit,
  submitLabel = t.restaurants.saveRestaurant,
  loading = false,
}: RestaurantFormProps) {
  const { data: cuisines, isLoading: cuisinesLoading } = useCuisines();
  const {
    coords,
    loading: locationLoading,
    error: locationError,
    permissionDenied,
    requestLocation,
  } = useCurrentLocation();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [cuisineTypeId, setCuisineTypeId] = useState<string | null>(
    initialValues?.cuisine_type_id ?? null
  );
  const [rating, setRating] = useState(initialValues?.rating ?? 3);
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    initialValues?.google_maps_url ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cuisineOptions: SelectOption[] = (cuisines ?? []).map((c) => ({
    value: c.id,
    label: translateCuisine(c.name),
  }));

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t.restaurants.nameRequired;
    if (!cuisineTypeId)
      newErrors.cuisine_type_id = t.restaurants.cuisineTypeRequired;
    if (rating < RATING_MIN || rating > RATING_MAX)
      newErrors.rating = t.restaurants.ratingRange(RATING_MIN, RATING_MAX);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const urlValue = googleMapsUrl.trim() || null;
    let lat = coords?.latitude ?? initialValues?.latitude ?? null;
    let lng = coords?.longitude ?? initialValues?.longitude ?? null;

    if ((lat == null || lng == null) && urlValue) {
      const parsed = parseGoogleMapsUrl(urlValue);
      if (parsed) {
        lat = parsed.latitude;
        lng = parsed.longitude;
      }
    }

    await onSubmit({
      name: name.trim(),
      cuisine_type_id: cuisineTypeId,
      rating,
      notes: notes.trim() || null,
      latitude: lat,
      longitude: lng,
      address: address.trim() || null,
      google_maps_url: urlValue,
    });
  }

  return (
    <ScrollView className="flex-1 bg-cream-100 dark:bg-bark-900 px-6 pt-4">
      <Input
        label={t.restaurants.name}
        value={name}
        onChangeText={setName}
        placeholder={t.restaurants.namePlaceholder}
        error={errors.name}
        textColor="#FFFFFF"
      />

      <Select
        label={t.restaurants.cuisineType}
        options={cuisineOptions}
        value={cuisineTypeId}
        onChange={setCuisineTypeId}
        placeholder={
          cuisinesLoading ? t.restaurants.cuisineLoading : t.restaurants.cuisineSelect
        }
        error={errors.cuisine_type_id}
        textColor="#FFFFFF"
      />

      <RatingSelector value={rating} onChange={setRating} />

      <Input
        label={t.restaurants.notesLabel}
        value={notes}
        onChangeText={setNotes}
        placeholder={t.restaurants.notesPlaceholder}
        multiline
        numberOfLines={3}
        textColor="#FFFFFF"
      />

      <View className="mb-6">
        <Text className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-2 tracking-wide">
          {t.restaurants.location}
        </Text>

        {Platform.OS === "web" ? (
          <Input
            label={t.restaurants.googleMapsLink}
            value={googleMapsUrl}
            onChangeText={setGoogleMapsUrl}
            placeholder={t.restaurants.googleMapsLinkPlaceholder}
            keyboardType="url"
            autoCapitalize="none"
            textColor="#FFFFFF"
          />
        ) : (
          <>
            {coords ? (
              <View className="bg-olive-50 dark:bg-olive-900/20 p-4 rounded-2xl border-2 border-olive-200 dark:border-olive-800 mb-3 flex-row items-center justify-between">
                <Text className="text-olive-700 dark:text-olive-300 font-medium">
                  📍 {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                </Text>
                <Pressable onPress={() => requestLocation()}>
                  <Text className="text-olive-500 text-sm">📍</Text>
                </Pressable>
              </View>
            ) : (
              <Button
                title={
                  locationLoading
                    ? t.restaurants.getLocation
                    : t.restaurants.useCurrentLocation
                }
                variant="secondary"
                onPress={requestLocation}
                loading={locationLoading}
                className="mb-3"
              />
            )}

            {permissionDenied && (
              <Text className="text-red-500 text-sm mt-2 font-medium">
                {t.restaurants.locationDenied}
              </Text>
            )}

            {locationError && (
              <Text className="text-red-500 text-sm mt-2 font-medium">
                {locationError}
              </Text>
            )}
          </>
        )}

        <Input
          label={t.restaurants.address}
          value={address}
          onChangeText={setAddress}
          placeholder={t.restaurants.addressPlaceholder}
          textColor="#FFFFFF"
        />
      </View>

      <Button
        title={submitLabel}
        onPress={handleSubmit}
        loading={loading}
        size="lg"
      />

      <View className="h-10" />
    </ScrollView>
  );
}
