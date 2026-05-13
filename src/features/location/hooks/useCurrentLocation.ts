import { useState, useCallback } from "react";
import { locationService } from "../services/locationService";
import { t } from "@shared/config/translations";
import type { LocationCoords } from "../types/location";

interface UseCurrentLocationReturn {
  coords: LocationCoords | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
  requestLocation: () => Promise<void>;
  reset: () => void;
}

export function useCurrentLocation(): UseCurrentLocationReturn {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    try {
      const granted = await locationService.requestForegroundPermission();

      if (!granted) {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      const position = await locationService.getCurrentPosition();
      setCoords(position);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t.errors.failedToGetLocation;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCoords(null);
    setError(null);
    setPermissionDenied(false);
    setLoading(false);
  }, []);

  return {
    coords,
    loading,
    error,
    permissionDenied,
    requestLocation,
    reset,
  };
}
