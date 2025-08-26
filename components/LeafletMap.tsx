"use client";
import L from "leaflet";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const defaultIcon = new L.Icon({
  iconUrl: "/marker-icon-blue.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: "/marker-icon-red.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: "/person-icon.png", // Caminho relativo dentro da pasta public
  iconSize: [32, 32], // Tamanho em pixels do ícone no mapa (ajuste para ficar pequeno)
  iconAnchor: [16, 32], // Ponto do ícone que será posicionado na coordenada [lat,lng] (16 = metade da largura, 32 = base do ícone)
  popupAnchor: [0, -32], // Ponto relativo para o popup abrir (para ficar acima do ícone)
  shadowUrl: "", // Se não tiver sombra, deixe vazio
  shadowSize: [0, 0],
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Location {
  id: number;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LeafletMapProps {
  locations: Location[];
}

export default function LeafletMap({ locations }: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[-22.9249, -42.5084]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={
              selectedLocationId === location.id ? selectedIcon : defaultIcon
            }
            eventHandlers={{
              click: () => setSelectedLocationId(location.id),
            }}
          >
            <Popup
              eventHandlers={{
                remove: () => setSelectedLocationId(null),
              }}
            >
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {location.description}
                </p>
                <p className="text-xs text-gray-500">{location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
