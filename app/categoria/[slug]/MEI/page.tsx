//MEI/CATEGORIA
"use client";

import Link from "next/link";
import { ArrowLeft, Star, MapPin, Phone, Globe, Instagram } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SwiperCarousel } from "../../../../components/CarouselMEI";
import dynamic from "next/dynamic";
import L from "leaflet";
import { TiltImage } from "@/components/ui/TiltImage";
import "leaflet/dist/leaflet.css";
import { categories } from "@/app/page";
import Image from "next/image";
import { getEstablishmentById, getReviewsByEstablishment } from "@/lib/api";


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

export default function MeiDetailPage({ params }: { params: { slug: string }; }) {
  //  Estados para armazenar os dados da API
  const [meiDetails, setMeiDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    const fetchMeiData = async () => {
      // O 'id' vem do slug da URL
      const meiId = params.slug;
      if (!meiId) return;

      try {
        setIsLoading(true);
        const detailsData = await getEstablishmentById(meiId);
        const reviewsData = await getReviewsByEstablishment(meiId);
        
        setMeiDetails(detailsData);
        setReviews(reviewsData);
        setRating(detailsData.media || 0); // Ajuste: usa 'media' do detailsData ou 0
      } catch (error) {
        console.error("Falha ao buscar dados do MEI:", error);
        setMeiDetails(null); // Define como nulo em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeiData();
    setIsClient(true);
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!meiDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Estabelecimento não encontrado.</p>
        <Link href="/">Voltar</Link>
      </div>
    );
  }

  // Encontra o 'id' da categoria para o link de "Voltar"
  const categoryInfo = categories.find(cat => cat.title === meiDetails.categoria);
  const categorySlug = categoryInfo ? categoryInfo.id : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-orange-400">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Link
            href={`/categoria/${categorySlug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-800 truncate pr-12">
            {meiDetails.nomeFantasia}
          </h1>
        </div>
      </header>

      <main className="w-full p-4 md:p-6 ">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col">
                <div className="mb-4 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {meiDetails.nomeFantasia}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 px-auto justify-center">
                    <StarRating rating={rating} />
                    <span className="text-gray-600 font-semibold">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({reviews.length} avaliações)
                    </span>
                  </div>
                </div>

                <div className="milecem:pl-10 milecem:mt-6 flex flex-col h-full ">
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {meiDetails.descricao}
                    </p>
                  </div>
                  {/* Se houver um campo de diferencial, pode ser adicionado aqui */}
                  <div className="hidden quinhentos:mt-6 quinhentos:flex items-center md:mt-10 ">
                    <span>Instagram:</span>
                    <a
                      href={meiDetails.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600 transition-colors ml-1"
                    >
                      <Instagram size={26} strokeWidth={2} />
                    </a>
                    <span className="ml-2.5 milecem:ml-5 desktop:ml-10">
                      Website:
                    </span>
                    <a
                      href={meiDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors ml-1"
                    >
                      <Globe size={26} strokeWidth={2} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:col-span-1">
                <div className="w-auto h-auto rounded-lg">
                  <TiltImage
                    src={meiDetails.logoUrl || "/placeholder-logo.png"} // Usa um placeholder se não houver logo
                    alt={`Logo de ${meiDetails.nomeFantasia}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center quinhentos:hidden">
                <span>Instagram:</span>
                <a
                  href={meiDetails.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors ml-1"
                >
                  <Instagram size={26} strokeWidth={2} />
                </a>

                <span className="ml-2.5 milecem:ml-5 desktop:ml-10">Site:</span>
                <a
                  href={meiDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors ml-1"
                >
                  <Globe size={26} strokeWidth={2} />
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Localização e Contato
            </h3>
            <div className="w-full h-80 bg-gray-200 rounded-3xl overflow-hidden mb-4 border">
              {isClient && meiDetails.coordenadas ? (
                <MapContainer
                  center={[meiDetails.coordenadas.lat, meiDetails.coordenadas.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[meiDetails.coordenadas.lat, meiDetails.coordenadas.lng]}
                    icon={defaultIcon}
                  >
                    <Popup>{meiDetails.nomeFantasia}</Popup>
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
                <span>{meiDetails.endereco}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>{meiDetails.contatoEstabelecimento}</span>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações
            </h3>
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.avaliacoesId} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{review.Usuario}</p>
                      <div className="flex items-center gap-1 my-1">
                        <StarRating rating={review.nota} />
                      </div>
                      <p className="text-gray-600">{review.comentario}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Ainda não há avaliações para este local.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}