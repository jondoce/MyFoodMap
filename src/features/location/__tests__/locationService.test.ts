jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: {
    Balanced: 4,
  },
}));

import { locationService } from "../services/locationService";
import * as ExpoLocation from "expo-location";

const mockRequestForegroundPermissionsAsync =
  ExpoLocation.requestForegroundPermissionsAsync as jest.Mock;
const mockGetCurrentPositionAsync =
  ExpoLocation.getCurrentPositionAsync as jest.Mock;

describe("locationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requestForegroundPermission", () => {
    it("returns true when permission is granted", async () => {
      mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
        status: "granted",
      });

      const result = await locationService.requestForegroundPermission();

      expect(result).toBe(true);
      expect(mockRequestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it("returns false when permission is denied", async () => {
      mockRequestForegroundPermissionsAsync.mockResolvedValueOnce({
        status: "denied",
      });

      const result = await locationService.requestForegroundPermission();

      expect(result).toBe(false);
    });
  });

  describe("getCurrentPosition", () => {
    it("returns coordinates on success", async () => {
      mockGetCurrentPositionAsync.mockResolvedValueOnce({
        coords: { latitude: 40.4168, longitude: -3.7038 },
      });

      const result = await locationService.getCurrentPosition();

      expect(result).toEqual({
        latitude: 40.4168,
        longitude: -3.7038,
      });
    });

    it("throws on failure", async () => {
      mockGetCurrentPositionAsync.mockRejectedValueOnce(
        new Error("Location unavailable")
      );

      await expect(locationService.getCurrentPosition()).rejects.toThrow(
        "Location unavailable"
      );
    });
  });
});
