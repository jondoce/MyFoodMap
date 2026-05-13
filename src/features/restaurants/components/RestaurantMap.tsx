import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useCurrentLocation } from "@features/location/hooks/useCurrentLocation";
import type { Restaurant } from "../types/restaurant";

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onError?: (error: string | null) => void;
}

export function RestaurantMap({ restaurants, onError }: RestaurantMapProps) {
  const { coords } = useCurrentLocation();
  const mapRef = useRef<MapView>(null);
  const [error, setError] = useState<string | null>(null);

  const initialRegion = coords
    ? {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : {
        latitude: 40.4168,
        longitude: -3.7038,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude!,
              longitude: restaurant.longitude!,
            }}
            pinColor="#EE7A24"
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{restaurant.name}</Text>
                <View style={styles.stars}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.star,
                        i < restaurant.rating
                          ? styles.starFilled
                          : styles.starEmpty,
                      ]}
                    />
                  ))}
                </View>
                {restaurant.cuisine_type && (
                  <Text style={styles.calloutCuisine}>
                    {restaurant.cuisine_type.name}
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  callout: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calloutName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1C1917",
    marginBottom: 2,
  },
  calloutDish: {
    fontSize: 14,
    color: "#6B5B4F",
    marginBottom: 4,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  starFilled: {
    backgroundColor: "#EE7A24",
  },
  starEmpty: {
    backgroundColor: "#E5E1DB",
  },
  calloutCuisine: {
    fontSize: 12,
    color: "#9C8B7E",
    marginTop: 4,
  },
});
