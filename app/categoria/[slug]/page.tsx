"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone, Globe, Search } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { db } from "../../firebasePV";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useMap } from "react-leaflet";
import { categories } from "../../page";
import L from "leaflet";
import ModernCarousel from "@/components/ModernCarousel";
import { onSnapshot } from "firebase/firestore";
import { useUserLocation } from "../../../components/userlocation";

const userIcon = new L.Icon({
  iconUrl: "/person-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: "",
  shadowSize: [0, 0],
});

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

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface PageProps {
  params: {
    slug: string;
  };
}

function MapInstanceHandler({
  onMapReady,
}: {
  onMapReady: (mapInstance: any) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

// Função para calcular distância entre coordenadas (Haversine)
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export default function CategoryPage({ params }: PageProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [mapKey, setMapKey] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -22.9249, -42.5084,
  ]);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Novos estados para geolocalização
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [nearestLocations, setNearestLocations] = useState<any[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const userPosition = useUserLocation();
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMapKey((prev) => prev + 1), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cacheKey = `locations_${params.slug}`;
    setIsLoading(true);

    // Tenta pegar dados do cache localStorage
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const cacheTimestamp = parsed.timestamp;
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hora

        if (now - cacheTimestamp < oneHour) {
          setLocations(parsed.data);
          setIsLoading(false);
          return; // Sai da função, cache válido
        }
      }
    } catch (err) {
      console.warn("Erro ao ler cache localStorage", err);
    }

    // Se cache não válido, ou não existe, faz a consulta em tempo real com onSnapshot
    const categoryInfo = categories.find((cat) => cat.id === params.slug);
    let categoryTitle = categoryInfo ? categoryInfo.title : "";

    if (!categoryTitle) {
      setLocations([]);
      setIsLoading(false);
      return;
    }

    const locationsRef = collection(db, "locations");
    const q = query(locationsRef, where("category", "==", categoryTitle));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          let parsedCoordinates = null;

          if (typeof docData.coordinates === "string") {
            try {
              parsedCoordinates = JSON.parse(docData.coordinates);
            } catch (e) {
              console.error(
                "Erro ao fazer parse das coordenadas:",
                docData.coordinates,
                e
              );
              parsedCoordinates = null;
            }
          } else if (
            typeof docData.coordinates === "object" &&
            docData.coordinates !== null
          ) {
            parsedCoordinates = docData.coordinates;
          }

          return {
            id: doc.id,
            ...docData,
            coordinates: parsedCoordinates,
          };
        });

        // Atualiza cache localStorage
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data,
          })
        );

        setLocations(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro no onSnapshot:", error);
        setLocations([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe(); // limpa listener quando componente desmontar
  }, [params.slug]);

  // Obter geolocalização e calcular locais próximos quando locations mudarem
  useEffect(() => {
    if (!locations || locations.length === 0) {
      setNearestLocations([]);
      return;
    }

    if (!("geolocation" in navigator)) {
      setGeoError("Geolocalização não é suportada pelo seu navegador.");
      setNearestLocations([]);
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const locationsWithDistance = locations
          .map((loc) => {
            if (loc.coordinates && loc.coordinates.lat && loc.coordinates.lng) {
              const dist = getDistanceFromLatLonInKm(
                latitude,
                longitude,
                loc.coordinates.lat,
                loc.coordinates.lng
              );
              return { ...loc, distance: dist };
            }
            return { ...loc, distance: Infinity };
          })
          .filter((loc) => loc.distance !== Infinity)
          .sort((a, b) => a.distance - b.distance);

        setNearestLocations(locationsWithDistance.slice(0, 3));
        setGeoLoading(false);
      },
      (error) => {
        setGeoError("Não foi possível obter sua localização.");
        setNearestLocations([]);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }, [locations]);

 

 

  const category = categories.find((cat) => cat.id === params.slug);

  // Filtra os locais com base no termo de busca
  const filteredLocations = locations.filter(
    (location) =>
      (location.name &&
        typeof location.name === "string" &&
        location.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (location.description &&
        typeof location.description === "string" &&
        location.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Categoria não encontrada
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando locais...</p>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Nenhum local encontrado para esta categoria.
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br $`}>ICON</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
                  {category.title}
                </h1>
                <p className="text-gray-600 text-sm"></p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* --- NOVA SEÇÃO LOCAIS MAIS PRÓXIMOS --- */}
        {geoLoading && (
          <p className="text-center text-gray-600 mb-6">
            Buscando sua localização...
          </p>
        )}
        {geoError && (
          <div className="text-center text-red-600 mb-6">
            {geoError} <br />
            Para usar a função de locais mais próximos, por favor habilite a
            localização no seu navegador.
          </div>
        )}
        {!geoLoading && !geoError && nearestLocations.length > 0 && (
          <section className="mb-14 px-4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-semibold tracking-tight text-[#017DB9] mb-6 border-l-4 border-[#017DB9] pl-4"
            >
              Explore os locais mais próximos de você
            </motion.h2>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="flex flex-col md:flex-row gap-6 overflow-y-auto md:overflow-x-auto md:pb-3 max-h-[80vh]"
            >
              {nearestLocations.map((loc, i) => (
                <motion.div
                  key={loc.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="min-w-[250px] bg-white text-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-[#017DB9]/20 p-4 cursor-pointer flex-shrink-0 hover:scale-[1.03] transition-all duration-300"
                  
                >
                  {loc.imageUrl && (
                    <img
                      src={loc.imageUrl}
                      alt={loc.name}
                      className="w-full h-36 object-cover rounded-xl mb-4 border border-[#017DB9]/30"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-[#017DB9] mb-1">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-gray-600">{loc.address}</p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm font-medium text-[#017DB9]">
                      {loc.distance.toFixed(2)} km
                    </p>
                    {loc.rating && (
                      <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 fill-yellow-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.571L24 9.748l-6 5.853 1.417 8.269L12 18.896 4.583 23.87 6 15.6 0 9.748l8.332-1.59z" />
                        </svg>
                        <span>{loc.rating}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* Linha divisória elegante */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-5" />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold text-gray-800 tracking-tight"
              >
                Locais Recomendados
              </motion.h2>
    
            </div>

            {/*Barra de Pesquisa */}
            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                className="
                  w-full pl-12 pr-4 py-3
                  rounded-2xl border border-gray-200 bg-white shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-purple-600/80 focus:border-transparent
                  transition-all duration-300 placeholder-gray-400 text-sm
                  hover:shadow-md
                "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/*Contêiner com Barra de Rolagem */}
            <div className=" max-h-[50vh] overflow-y-auto px-4 lg:grid grid-cols-2 gap-2">
              {filteredLocations.map((location: any, index: number) => (
                <Link href={`${location.id}/MEI/`} key={location.id}>
                  <motion.div
                  
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`lg:max-w-100px bg-white rounded-xl max-h-[20vh] shadow-md p-6 cursor-pointer mb-4 transition-transform duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      selectedLocation?.id === location.id
                        ? "ring-2 ring-offset-2 ring-[#017DB9] shadow-lg"
                        : ""
                    }`}
                    
                  >
                    {location.imageUrl && (
                      <img
                        src={location.imageUrl}
                        alt={location.name}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {location.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {location.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-gray-600">
                              {location.rating}
                            </span>
                          </div>
                        )}
                        {selectedLocation?.id === location.id && (
                          <div className="w-2 h-2 bg-[#017DB9] rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{location.description}</p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {location.address}
                      </div>
                      {location.hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {location.hours}
                        </div>
                      )}
                      {location.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {location.phone}
                        </div>
                      )}
                      {location.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <a
                            href={location.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visitar site
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-0 h-fit" id="map-container">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-4"
            >
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> {category.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Clique em um ponto para saber mais
              </p>
            </motion.div>
            
            {/* 3. Substitua a div com a imagem de fundo pelo componente do carrossel */}
          <div className="w-full h-[300px] md:h-[500px] rounded-2xl shadow-lg overflow-hidden border border-purple-600">
          <ModernCarousel
              slides={[
                { imageUrl: "/gatinho.jpg", label: "Ver Gatinho mau" },
                { imageUrl: "/Alimentação.jpeg", label: "Comer até não aguentar" },
                { imageUrl: "/Moda.jpeg", label: "Ver roupas" },
              ]}
            />

        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
