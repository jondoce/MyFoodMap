import { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { useRestaurants } from "@features/restaurants/hooks/useRestaurants";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { EmptyState } from "@shared/components/EmptyState";
import { t } from "@shared/config/translations";
import { parseGoogleMapsUrl } from "@lib/googleMaps";
import { useRouter } from "expo-router";

interface RestaurantWithCoords {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\\/g, "\\\\");
}

function getMapHTML(restaurants: RestaurantWithCoords[]) {
  if (restaurants.length === 0) return "";
  
  const centerLat = restaurants.reduce((sum, r) => sum + r.latitude, 0) / restaurants.length;
  const centerLng = restaurants.reduce((sum, r) => sum + r.longitude, 0) / restaurants.length;
  
  let markers = "";
  restaurants.forEach(r => {
    const lat = r.latitude;
    const lng = r.longitude;
    const name = escapeHtml(r.name);
    markers += `L.marker([${lat}, ${lng}]).addTo(map).bindPopup('<a href="/restaurant/${r.id}" style="font-weight:bold;text-decoration:none;color:#1a73e8;" onclick="window.ReactNativeWebView.postMessage(&#39;/restaurant/${r.id}&#39;);return false;">${name}</a>', {closeButton: false});\n`;
  });
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>body { margin: 0; } #map { width: 100vw; height: 100vh; }</style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${centerLat}, ${centerLng}], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    ${markers}
  </script>
</body>
</html>`;
}

export default function MapScreen() {
  const { data: restaurants, isLoading } = useRestaurants();
  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner message={t.map.loading} />;
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <EmptyState
        title={t.map.noRestaurants}
        description={t.map.noRestaurantsDesc}
        emoji="🗺️"
      />
    );
  }

  const restaurantsWithLocation = useMemo(() => {
    return restaurants.reduce<RestaurantWithCoords[]>((acc, r) => {
      if (r.latitude !== null && r.longitude !== null) {
        acc.push({ id: r.id, latitude: r.latitude, longitude: r.longitude, name: r.name });
      } else if (r.google_maps_url) {
        const coords = parseGoogleMapsUrl(r.google_maps_url);
        if (coords) {
          acc.push({ id: r.id, latitude: coords.latitude, longitude: coords.longitude, name: r.name });
        }
      }
      return acc;
    }, []);
  }, [restaurants]);

  const mapHTML = useMemo(() => {
    if (restaurantsWithLocation.length === 0) return "";
    return getMapHTML(restaurantsWithLocation);
  }, [restaurantsWithLocation]);

  if (restaurantsWithLocation.length === 0) {
    return (
      <EmptyState
        title={t.map.noLocations}
        description={t.map.noLocationsDesc}
        emoji="📍"
      />
    );
  }

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    const url = event.nativeEvent.data;
    if (url.includes("/restaurant/")) {
      const restaurantId = url.split("/restaurant/")[1];
      if (restaurantId) {
        router.push(`/restaurant/${restaurantId}`);
      }
    }
  };

  return (
    <View className="flex-1">
      <WebView
        source={{ html: mapHTML }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["about:blank"]}
        startInLoadingState={true}
        renderLoading={() => <LoadingSpinner message="Cargando mapa..." />}
        onMessage={handleMessage}
      />
    </View>
  );
}
