"use client";

import Link from "next/link";
import { ArrowLeft, Star, MapPin, Phone, Globe } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SwiperCarousel } from "../../../../components/CarouselMEI";

// Importações do Mapa
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- DADOS DE EXEMPLO (SUBSTITUA PELA SUA BUSCA NO FIREBASE) ---
const mei = {
  name: "Art's & Crochê",
  rating: 4.7,
  reviewsCount: 23,
  description: "Art's & Crochê é um espaço dedicado à arte do crochê...",
  category: "telefones-uteis",
  images: ["/placeholder.jpg", "/gatinho.jpg", "/placeholder.jpg"],
  address: "Rua das Artes, 123 - Centro, Saquarema - RJ",
  phone: "(22) 99999-8888",
  website: "http://googleusercontent.com/instagram.com/artsecroche",
  coordinates: {
    lat: -22.921,
    lng: -42.509,
  },
  reviews: [
    { id: 1, user: "Maria S.", rating: 5, comment: "Peças maravilhosas..." },
    {
      id: 2,
      user: "João P.",
      rating: 4,
      comment: "O atendimento foi ótimo...",
    },
  ],
};
// --- FIM DOS DADOS DE EXEMPLO ---

// Configuração dos ícones do mapa
const defaultIcon = new L.Icon({
  iconUrl: "/marker-icon-blue.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componentes do Mapa carregados dinamicamente
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

// Componente para renderizar as estrelas de avaliação
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400 fill-yellow-400"
        />
      ))}
      {halfStar && <Star key="half" className="w-5 h-5 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
};

export default function MeiDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Estado para garantir que o mapa só renderize no lado do cliente
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // TODO: Adicione aqui sua lógica para buscar os dados do MEI do Firebase

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Link
            href={`/categoria/${mei.category}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-800 truncate pr-12">
            {mei.name}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-8">
          {/* ... Seção do Carrossel ... */}

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900">{mei.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={mei.rating} />
              <span className="text-gray-600 font-semibold">
                {mei.rating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({mei.reviewsCount} avaliações)
              </span>
            </div>
            <p className="text-gray-700 mt-4 leading-relaxed">
              {mei.description}
            </p>
          </section>

          {/* ===== SEÇÃO DO MAPA MOVIDA PARA CÁ ===== */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Localização e Contato
            </h3>
            <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden mb-4 border">
              {isClient && mei.coordinates ? (
                <MapContainer
                  center={[mei.coordinates.lat, mei.coordinates.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[mei.coordinates.lat, mei.coordinates.lng]}
                    icon={defaultIcon}
                  >
                    <Popup>{mei.name}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p className="flex items-center justify-center h-full text-gray-500">
                  Carregando mapa...
                </p>
              )}
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                <span>{mei.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>{mei.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <a
                  href={mei.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visitar site ou rede social
                </a>
              </div>
            </div>
          </section>
          {/* ======================================= */}

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações
            </h3>
            <div className="space-y-6">
              {mei.reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <div className="flex items-center gap-1 my-1">
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
