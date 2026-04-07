/**
 * Navigation Utility Functions
 * Helpers for opening navigation apps from incident coordinates
 */

/**
 * Validates if coordinates are valid numbers
 */
export const isValidCoordinates = (
  lat: number | string | undefined,
  lng: number | string | undefined,
): boolean => {
  if (lat === undefined || lng === undefined) return false;

  const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
  const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
};

/**
 * Opens Google Maps navigation to incident location
 * Works on both desktop (browser) and mobile (Google Maps app)
 */
export const openGoogleMapsNavigation = (
  lat: number | string | undefined,
  lng: number | string | undefined,
  locationName?: string,
): void => {
  if (!isValidCoordinates(lat, lng)) {
    console.warn("Invalid coordinates for navigation:", { lat, lng });
    return;
  }

  try {
    const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
    const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

    // Google Maps navigation endpoint
    // Works on desktop and mobile (tries to open Maps app first)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}${locationName ? `&destination_place_id=${encodeURIComponent(locationName)}` : ""}`;

    window.open(url, "_blank");
    console.log("Opening Google Maps navigation:", { latitude, longitude });
  } catch (error) {
    console.error("Error opening Google Maps navigation:", error);
  }
};

/**
 * Opens Waze navigation to incident location
 * Mobile-first approach - works best on Waze app
 */
export const openWazeNavigation = (
  lat: number | string | undefined,
  lng: number | string | undefined,
): void => {
  if (!isValidCoordinates(lat, lng)) {
    console.warn("Invalid coordinates for Waze navigation:", { lat, lng });
    return;
  }

  try {
    const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
    const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

    // Waze navigation endpoint
    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

    window.open(url, "_blank");
    console.log("Opening Waze navigation:", { latitude, longitude });
  } catch (error) {
    console.error("Error opening Waze navigation:", error);
  }
};

/**
 * Opens incident location in Google Maps (view only, no navigation)
 */
export const openGoogleMapsView = (
  lat: number | string | undefined,
  lng: number | string | undefined,
): void => {
  if (!isValidCoordinates(lat, lng)) {
    console.warn("Invalid coordinates for Google Maps view:", { lat, lng });
    return;
  }

  try {
    const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
    const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

    // Google Maps view endpoint (no navigation, just view)
    const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;

    window.open(url, "_blank");
    console.log("Opening Google Maps view:", { latitude, longitude });
  } catch (error) {
    console.error("Error opening Google Maps view:", error);
  }
};

/**
 * Gets appropriate navigation URL based on platform
 * Returns object with multiple navigation options
 */
export const getNavigationOptions = (
  lat: number | string | undefined,
  lng: number | string | undefined,
) => {
  return {
    isValid: isValidCoordinates(lat, lng),
    googleMapsNav: () => openGoogleMapsNavigation(lat, lng),
    wazeNav: () => openWazeNavigation(lat, lng),
    googleMapsView: () => openGoogleMapsView(lat, lng),
  };
};
