import { useState, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface UseGeolocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  requestLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLocation({ lat, lng });
        setHasPermission(true);
        setIsLoading(false);
        console.log("✅ Geolocation obtained:", { lat, lng });
      },
      (geolocationError) => {
        setHasPermission(false);
        setIsLoading(false);

        switch (geolocationError.code) {
          case geolocationError.PERMISSION_DENIED:
            setError(
              "Location permission denied. Enable in your browser settings.",
            );
            console.warn("Geolocation permission denied");
            break;
          case geolocationError.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            console.warn("Geolocation position unavailable");
            break;
          case geolocationError.TIMEOUT:
            setError("Location request timed out.");
            console.warn("Geolocation timeout");
            break;
          default:
            setError(
              "An unknown error occurred while retrieving your location.",
            );
            console.warn("Geolocation error:", geolocationError);
        }
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
      },
    );
  };

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    hasPermission,
    requestLocation,
  };
};
