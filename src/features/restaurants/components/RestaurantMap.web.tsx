import { View, Text, StyleSheet } from "react-native";
import type { Restaurant } from "../types/restaurant";
import { t } from "@shared/config/translations";

interface RestaurantMapProps {
  restaurants: Restaurant[];
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <View
          key={i}
          style={[
            styles.star,
            i < rating ? styles.starFilled : styles.starEmpty,
          ]}
        />
      ))}
    </View>
  );
}

export function RestaurantMap({ restaurants }: RestaurantMapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapTitle}>{t.restaurants.mapView}</Text>
        <Text style={styles.mapSubtitle}>
          {t.restaurants.mapMobileOnly}
        </Text>
      </View>

      <View style={styles.list}>
        {restaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.dot} />
              <Text style={styles.cardName} numberOfLines={1}>
                {restaurant.name}
              </Text>
            </View>
            <Text style={styles.cardDish} numberOfLines={1}>
              {restaurant.dish}
            </Text>
            <View style={styles.cardFooter}>
              <RatingStars rating={restaurant.rating} />
              {restaurant.cuisine_type && (
                <Text style={styles.cardCuisine}>
                  {restaurant.cuisine_type.name}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCFA",
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#F5F0EB",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E1DB",
  },
  mapEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1917",
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
    color: "#9C8B7E",
  },
  list: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EE7A24",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1917",
    flex: 1,
  },
  cardDish: {
    fontSize: 14,
    color: "#6B5B4F",
    marginBottom: 8,
    marginLeft: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 18,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  starFilled: {
    backgroundColor: "#EE7A24",
  },
  starEmpty: {
    backgroundColor: "#E5E1DB",
  },
  cardCuisine: {
    fontSize: 12,
    color: "#9C8B7E",
    fontWeight: "500",
  },
});
