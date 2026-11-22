"use client";

import { useCallback, useEffect, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export type TravelMapPlace = {
  id: string;
  name: string;
  region: string;
  trip: string;
  status: "Visited" | "Planned";
  latitude: number;
  longitude: number;
};

function MapViewport({ places }: { places: TravelMapPlace[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    const bounds = latLngBounds(places.map((place) => [place.latitude, place.longitude]));
    const frame = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 5.5, animate: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [map, places]);

  return null;
}

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false, debounceMoveend: true }));
    observer.observe(container);
    map.invalidateSize({ pan: false });
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function InteractiveTravelMap({
  places,
  selectedPlaceId,
  onSelectPlace,
}: {
  places: TravelMapPlace[];
  selectedPlaceId: string;
  onSelectPlace: (id: string) => void;
}) {
  const [tileError, setTileError] = useState(false);
  const [tileVersion, setTileVersion] = useState(0);
  const handleTileError = useCallback(() => setTileError(true), []);
  const handleTilesLoaded = useCallback(() => setTileError(false), []);

  return (
    <div className="leaflet-map-shell">
      <MapContainer
        className="leaflet-travel-map"
        center={[20.5937, 78.9629]}
        zoom={4}
        minZoom={3}
        maxZoom={12}
        scrollWheelZoom={false}
        aria-label="Interactive map of visited and planned destinations"
      >
        <TileLayer
          key={tileVersion}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: handleTileError, load: handleTilesLoaded }}
        />
        <MapResizeHandler />
        <MapViewport places={places} />
        {places.map((place) => {
          const selected = place.id === selectedPlaceId;
          const icon = divIcon({
            className: `travel-leaflet-marker ${place.status === "Visited" ? "visited" : "planned"}${selected ? " selected" : ""}`,
            html: '<span class="travel-leaflet-marker-pin"><span></span></span>',
            iconSize: [34, 42],
            iconAnchor: [17, 38],
            popupAnchor: [0, -36],
          });

          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={icon}
              eventHandlers={{ click: () => onSelectPlace(place.id) }}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.status} · {place.trip}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {tileError && (
        <div className="map-tile-error" role="status">
          <span>Some map tiles could not load.</span>
          <button type="button" onClick={() => { setTileError(false); setTileVersion((version) => version + 1); }}>Retry map</button>
        </div>
      )}
    </div>
  );
}
