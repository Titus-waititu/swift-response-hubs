import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle } from "lucide-react";

interface MapViewerProps {
  latitude?: number | string;
  longitude?: number | string;
  address?: string;
  title?: string;
}

export default function MapViewer({
  latitude,
  longitude,
  address,
  title = "Location Map",
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate coordinates
    const lat = parseFloat(String(latitude || 0));
    const lon = parseFloat(String(longitude || 0));

    if (isNaN(lat) || isNaN(lon)) {
      console.error("Invalid coordinates:", { latitude, longitude });
      setError("Invalid coordinates");
      setIsLoading(false);
      return;
    }

    // Check if coordinates are in valid range
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      console.error("Coordinates out of range:", { lat, lon });
      setError("Coordinates out of valid range");
      setIsLoading(false);
      return;
    }

    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      try {
        // Check if Leaflet is already loaded
        if ((window as any).L !== undefined) {
          console.log("Leaflet already loaded");
          initMap(lat, lon);
          return;
        }

        console.log("Loading Leaflet library...");

        // Load CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        link.onerror = () => {
          console.error("Failed to load Leaflet CSS");
          setError("Failed to load map styles");
          setIsLoading(false);
        };
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.async = true;
        script.onload = () => {
          console.log("Leaflet script loaded successfully");
          initMap(lat, lon);
        };
        script.onerror = () => {
          console.error("Failed to load Leaflet script");
          setError("Failed to load map library");
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } catch (err) {
        console.error("Error loading Leaflet:", err);
        setError("Failed to initialize map");
        setIsLoading(false);
      }
    };

    const initMap = (lat: number, lon: number) => {
      if (!mapContainer.current) {
        console.error("Map container not found");
        setError("Map container not available");
        setIsLoading(false);
        return;
      }

      try {
        const L = (window as any).L;
        if (!L) {
          throw new Error("Leaflet library not loaded");
        }

        console.log("Initializing map with coordinates:", { lat, lon });

        // Create map
        map.current = L.map(mapContainer.current).setView([lat, lon], 15);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.current);

        // Add marker
        L.marker([lat, lon])
          .addTo(map.current)
          .bindPopup(
            `<div class="text-sm"><strong>${address || "Incident Location"}</strong><br/>${lat.toFixed(6)}, ${lon.toFixed(6)}</div>`,
          )
          .openPopup();

        console.log("Map initialized successfully");
        setIsLoading(false);
      } catch (err) {
        console.error("Map initialization error:", err);
        setError("Failed to initialize map");
        setIsLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, address]);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600 dark:text-red-400">
              {error}
            </span>
          </div>
        ) : (
          <div
            ref={mapContainer}
            className={`w-full rounded-lg border border-border overflow-hidden transition-opacity ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
            style={{ height: "400px" }}
          />
        )}
        {address && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-sm">
            <p className="text-muted-foreground">
              <strong>Address:</strong> {address}
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Coordinates:</strong> {latitude}, {longitude}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
