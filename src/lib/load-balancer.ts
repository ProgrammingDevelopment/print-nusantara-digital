export type RegionEndpoint = {
  region: string;
  url: string;
  lat: number;
  lon: number;
};

const DEFAULT_REGIONS: RegionEndpoint[] = [
  { region: "asia-southeast1", url: window.location.origin, lat: -6.2, lon: 106.8 },
  { region: "us-central1", url: window.location.origin, lat: 39.0, lon: -98.0 },
  { region: "europe-west1", url: window.location.origin, lat: 50.0, lon: 8.0 },
];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const parseRegions = (): RegionEndpoint[] => {
  if (!import.meta.env.VITE_API_REGIONS) {
    return DEFAULT_REGIONS;
  }

  try {
    return JSON.parse(import.meta.env.VITE_API_REGIONS) as RegionEndpoint[];
  } catch {
    return DEFAULT_REGIONS;
  }
};

const getUserLocation = async (): Promise<{ lat: number; lon: number } | null> => {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      () => resolve(null),
      { timeout: 5000 },
    );
  });
};

const chooseNearestRegion = (
  location: { lat: number; lon: number },
  regions: RegionEndpoint[],
) => {
  let bestRegion = regions[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const region of regions) {
    const distance = haversineDistance(location.lat, location.lon, region.lat, region.lon);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestRegion = region;
    }
  }

  return bestRegion;
};

export const getNearestApiBaseUrl = async (): Promise<string> => {
  const regions = parseRegions();
  const location = await getUserLocation();

  if (!location) {
    return window.location.origin;
  }

  return chooseNearestRegion(location, regions).url;
};

export const getApiUrl = async (path: string): Promise<string> => {
  const baseUrl = await getNearestApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
