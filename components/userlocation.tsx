import { useState, useEffect } from "react";

export function useUserLocation() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return position;
}
