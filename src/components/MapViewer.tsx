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
  const initializingRef = useRef(false);

  useEffect(() => {
    // Validate coordinates
    const lat = parseFloat(String(latitude || 0));
    const lon = parseFloat(String(longitude || 0));

    if (isNaN(lat) || isNaN(lon)) {
      setError("Invalid coordinates");
      setIsLoading(false);
      return;
    }

    // Check if coordinates are in valid range
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      setError("Coordinates out of valid range");
      setIsLoading(false);
      return;
    }

    // Reset error state when coordinates change
    setError(null);
    setIsLoading(true);

    // Clean up container from old Leaflet artifacts
    if (mapContainer.current) {
      // Remove all child elements (old Leaflet DOM)
      while (mapContainer.current.firstChild) {
        mapContainer.current.removeChild(mapContainer.current.firstChild);
      }
      // Remove inline styles
      mapContainer.current.style.backgroundColor = "";
    }

    // Clean up existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Load Leaflet JS only - CSS is already in index.css
    const loadLeaflet = async () => {
      // Prevent double initialization in React StrictMode
      if (initializingRef.current) {
        return;
      }
      initializingRef.current = true;

      try {
        // Check if Leaflet is already loaded
        if ((window as any).L !== undefined) {
          // Small delay to ensure container is rendered
          setTimeout(() => initMap(lat, lon), 50);
          return;
        }

        // Verify CSS is loaded
        const leafletCss = Array.from(document.styleSheets).find((sheet) =>
          sheet.href?.includes("leaflet.min.css"),
        );

        // Load JS only
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.crossOrigin = "anonymous";
        script.async = true;

        script.onload = () => {
          setTimeout(() => {
            const L = (window as any).L;
            if (L) {
              initMap(lat, lon);
            } else {
              setError("Leaflet failed to initialize");
              setIsLoading(false);
              initializingRef.current = false;
            }
          }, 100);
        };

        script.onerror = () => {
          setError("Failed to load map library");
          setIsLoading(false);
          initializingRef.current = false;
        };

        document.body.appendChild(script);
      } catch (err) {
        setError("Failed to initialize map");
        setIsLoading(false);
        initializingRef.current = false;
      }
    };

    const initMap = (lat: number, lon: number) => {
      if (!mapContainer.current) {
        setError("Map container not available");
        setIsLoading(false);
        return;
      }

      try {
        const L = (window as any).L;
        if (!L) {
          throw new Error("Leaflet library not loaded");
        }

        // Ensure container is visible and sized

        // Ensure container is visible and sized
        if (
          mapContainer.current.offsetHeight === 0 ||
          mapContainer.current.offsetWidth === 0
        ) {
          setTimeout(() => initMap(lat, lon), 300);
          return;
        }

        // Remove existing map if any (safety check)
        if (map.current) {
          map.current.remove();
          map.current = null;
        }

        // Configure Leaflet icons BEFORE creating map
        try {
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          });
        } catch (iconErr) {
          // Icon configuration error - continue anyway
        }

        // Create map
        map.current = L.map(mapContainer.current, {
          preferCanvas: false,
        }).setView([lat, lon], 15);

        // Force container visibility and sizing explicitly
        if (mapContainer.current) {
          mapContainer.current.style.backgroundColor = "#e5e3df";
          mapContainer.current.style.width = "100%";
          mapContainer.current.style.height = "400px";
          mapContainer.current.style.display = "block";
        }

        // Use requestAnimationFrame for proper timing
        requestAnimationFrame(() => {
          if (!map.current) return;

          map.current.invalidateSize();

          // Add tile layer with fallback
          try {
            const tileLayer = L.tileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              {
                maxZoom: 19,
                minZoom: 0,
                crossOrigin: true,
                attribution:
                  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              },
            );

            tileLayer.addTo(map.current);

            // Check pane visibility with actual computed styles
            const tilePane = document.querySelector(
              ".leaflet-tile-pane",
            ) as HTMLElement;
            if (tilePane) {
              const computedStyle = window.getComputedStyle(tilePane);
              const tileCount = tilePane.querySelectorAll("img, canvas").length;
            }
          } catch (tileErr) {
            // Tile layer error handled gracefully
          }

          // Add marker with simple popup
          try {
            L.marker([lat, lon])
              .addTo(map.current)
              .bindPopup(
                `<div style="font-size: 12px; max-width: 200px;">
                  <strong>${address || "Incident Location"}</strong><br/>
                  ${lat.toFixed(6)}, ${lon.toFixed(6)}<br/>
                  <em style="display: block; margin-top: 8px; color: #666;">Use the "Start Navigation" button in the details panel</em>
                </div>`,
              )
              .openPopup();
          } catch (markerErr) {
            // Marker error handled gracefully
          }

          // Call invalidateSize again after layer is added
          setTimeout(() => {
            if (map.current) {
              map.current.invalidateSize();
              setIsLoading(false);
            }
          }, 100);
        });
      } catch (err) {
        setError("Failed to initialize map");
        setIsLoading(false);
        initializingRef.current = false;
      }
    };

    loadLeaflet();

    return () => {
      initializingRef.current = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // Clean container DOM
      if (mapContainer.current) {
        while (mapContainer.current.firstChild) {
          mapContainer.current.removeChild(mapContainer.current.firstChild);
        }
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
