export function parseGoogleMapsUrl(
  url: string | null
): { latitude: number; longitude: number } | null {
  if (!url) return null;

  try {
    const patterns = [
      /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[2]) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { latitude: lat, longitude: lng };
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}