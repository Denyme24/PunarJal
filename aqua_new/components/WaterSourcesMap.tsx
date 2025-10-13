"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WaterSource } from "@/lib/waterSourcesData";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on quality
const createCustomIcon = (quality: "safe" | "attention" | "critical") => {
  const colors = {
    safe: "#10b981", // green
    attention: "#f59e0b", // amber
    critical: "#ef4444", // red
  };

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 26 16 26s16-17.2 16-26c0-8.8-7.2-16-16-16z" fill="${colors[quality]}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

interface WaterSourcesMapProps {
  waterSources: WaterSource[];
  center: [number, number];
  onMarkerClick: (source: WaterSource) => void;
  selectedSource: WaterSource | null;
}

// Component to handle map centering
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function WaterSourcesMap({
  waterSources,
  center,
  onMarkerClick,
  selectedSource,
}: WaterSourcesMapProps) {
  const [mounted, setMounted] = useState(false);

  // Only render map on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      className="z-0"
    >
      <MapController center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {waterSources.map((source) => (
        <Marker
          key={source.id}
          position={source.coordinates}
          icon={createCustomIcon(source.quality)}
          eventHandlers={{
            click: () => {
              onMarkerClick(source);
            },
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{source.name}</p>
              <p className="text-xs text-gray-600">Click for details</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
