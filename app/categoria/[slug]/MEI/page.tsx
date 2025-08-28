"use client";

import { categories } from "../../../page";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Phone, Globe } from "lucide-react";
import React from "react";
import { SwiperCarousel } from "../../../../components/CarouselMEI";

// --- DADOS DE EXEMPLO (SUBSTITUA PELA SUA BUSCA NO FIREBASE) ---
// Simula os dados que viriam do seu banco de dados para um MEI específico.
const mei = {
  name: "Art's & Crochê",
  rating: 4.7,
  reviewsCount: 23,
  description:
    "Art's & Crochê é um espaço dedicado à arte do crochê, oferecendo desde peças de decoração únicas até roupas e amigurumis feitos com amor e carinho. Tudo produzido à mão, com material de alta qualidade.",
  category: "telefones-uteis",
  images: [
    "/placeholder.jpg", // Substitua pelos caminhos das suas imagens
    "/gatinho.jpg",
    "/placeholder.jpg",
  ],
  address: "Rua das Artes, 123 - Centro, Saquarema - RJ",
  phone: "(22) 99999-8888",
  website: "http://googleusercontent.com/instagram.com/artsecroche",
  coordinates: {
    lat: -22.921,
    lng: -42.509,
  },
  reviews: [
    {
      id: 1,
      user: "Maria S.",
      rating: 5,
      comment:
        "Peças maravilhosas, tudo com um capricho sem igual. Amei meu novo amigurumi!",
    },
    {
      id: 2,
      user: "João P.",
      rating: 4,
      comment:
        "O atendimento foi ótimo e o produto é de qualidade. A entrega demorou um pouco, mas valeu a pena.",
    },
  ],
};
// --- FIM DOS DADOS DE EXEMPLO ---

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
  // TODO: Adicione aqui sua lógica para buscar os dados do MEI do Firebase usando o `params.slug`
  // e substituir o objeto 'mei' de exemplo acima.

  // Busca a categoria correta usando o slug dos parâmetros

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho com Botão de Voltar */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Link
            href={`/categoria/${mei.category}`} // ALTERAR PARA BUSAR NO BANCO DE DADOS
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

      {/* Conteúdo da Página */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-8">
          {/* Seção do Carrossel de Imagens */}
          {/* COLOQUE SEU COMPONENTE DE CARROSSEL AQUI 
          <section>
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden relative shadow-lg">
                Exemplo: <ImageCarousel images={mei.images} />
                <SwiperCarousel />

              <img
                src={mei.images[0]}
                alt={mei.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <span className="block w-2 h-2 bg-white rounded-full"></span>
                <span className="block w-2 h-2 bg-white/50 rounded-full"></span>
                <span className="block w-2 h-2 bg-white/50 rounded-full"></span>
              </div>
            </div>
          </section>
          */}

          {/* Seção de Informações Principais */}
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

          {/* Seção de Localização e Contato */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Localização e Contato
            </h3>
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
              {/* COLOQUE SEU COMPONENTE DE MAPA AQUI
                 Exemplo: <LeafletMap coordinates={mei.coordinates} />
               */}
              <p className="flex items-center justify-center h-full text-gray-500">
                Componente do Mapa aqui
              </p>
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

          {/* Seção de Avaliações */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações
            </h3>
            <div className="space-y-6">
              {mei.reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0">
                    {/* Placeholder para foto do usuário */}
                  </div>
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
