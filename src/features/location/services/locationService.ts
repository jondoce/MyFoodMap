import * as ExpoLocation from "expo-location";
import type { LocationCoords } from "../types/location";

export const locationService = {
  async requestForegroundPermission(): Promise<boolean> {
    const { status } =
      await ExpoLocation.requestForegroundPermissionsAsync();
    return status === "granted";
  },

  async getCurrentPosition(): Promise<LocationCoords> {
    const location = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },
};
