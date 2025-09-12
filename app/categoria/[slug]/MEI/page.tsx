//MEI/CATEGORIA
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  PhoneForwarded,
  Globe,
  Instagram,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { TiltImage } from "@/components/ui/TiltImage";
import "leaflet/dist/leaflet.css";
import { categories } from "@/app/page";
import Image from "next/image";
import { getEstablishmentById, getReviewsByEstablishment } from "@/lib/api";
import AvaliacaoModalButton from "@/components/Pop-up Coments";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import SwiperCarousel from "@/components/CarouselMEI";

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

const REVIEWS_PER_PAGE = 4;

export default function MeiDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  //  Estados para armazenar os dados da API
  const [meiDetails, setMeiDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateReviews, setAnimateReviews] = useState(false);

  useEffect(() => {
    const fetchMeiData = async () => {
      const meiId = params.slug;
      if (!meiId) return;

      try {
        setIsLoading(true);
        const detailsData = await getEstablishmentById(meiId);
        const reviewsData = await getReviewsByEstablishment(meiId);

        setMeiDetails(detailsData);
        setReviews(reviewsData);
        setRating(detailsData.media || 0);

        // Ativar animação após carregar os dados
        setAnimateReviews(true);
      } catch (error) {
        console.error("Falha ao buscar dados do MEI:", error);
        setMeiDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeiData();
    setIsClient(true);
  }, [params.slug]);

  useEffect(() => {
    setAnimateReviews(false);
    const timer = setTimeout(() => {
      setAnimateReviews(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

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
        <Link href="/" className="hidden md:block">
          Voltar
        </Link>
      </div>
    );
  }

  const categoryInfo = categories.find(
    (cat) => cat.title === meiDetails.categoria
  );
  const categorySlug = categoryInfo ? categoryInfo.id : "";

  // Lógica de Paginação
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#017DB9] to-[#22c362]">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Link
            href={`/categoria/${categorySlug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-[#017DB9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-3 md:mr-0" />
            <p className="hidden md:block">Voltar</p>
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
                      <Instagram size={22} strokeWidth={2} />
                    </a>
                    <span className="ml-2.5 milecem:ml-5 desktop:ml-10">
                      Whatsapp:
                    </span>
                    <a
                      href={`https://wa.me/${meiDetails.contatoEstabelecimento.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#22c362] transition-colors ml-1"
                    >
                      <PhoneForwarded size={22} strokeWidth={2} />
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
                  <Instagram size={22} strokeWidth={2} />
                </a>

                <span className="ml-2.5 milecem:ml-5 desktop:ml-10">
                  Whatsapp:
                </span>
                <a
                  href={`https://wa.me/${meiDetails.contatoEstabelecimento.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#22c362] transition-colors ml-1"
                >
                  <PhoneForwarded size={22} strokeWidth={2} />
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Portifólio de Produdos
            </h3>
            <div className="w-full h-fit bg-gray-200 rounded-3xl overflow-hidden mb-4 border flex flex-col milecem:flex-row">
              <div className=" w-full milecem:w-[50%] h-full relative mx-auto">
                <SwiperCarousel />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%] grid grid-cols-1 milecem:grid-cols-4  gap-6">
            <div className="space-y-3 text-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Área de Atuação
              </h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                <span>{meiDetails.endereco}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>{meiDetails.contatoEstabelecimento}</span>
              </div>
            </div>

            <div className="w-full h-fit bg-gray-200 rounded-3xl overflow-hidden mb-4 border flex flex-col milecem:flex-row md:col-span-3 ">
              <div className="">
                <div className="milecem:w-[100%] py-5 px-5 milecem:px-10 text-gray-700 break-words">
                  {" "}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 miletrezentos:grid-cols-5 milesetecentos:grid-cols-6 fullhd:grid-cols-7 quadhd:grid-cols-8 telona:grid-cols-10 gap-3">
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Padaria Doce Pão
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Restaurante Central
                    </div>

                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Padaria Doce Pão pao pao pao pao
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Farmácia Vida
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Lanchonete Express
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Barra Nova
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Vilatur
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Porto da Roça II
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Itaúna
                    </div>
                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Restaurante Central
                    </div>

                    <div
                      className="px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-400 bg-gray-100 text-gray-600 select-none 
                   flex items-center justify-center 
                   cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:-translate-y-1"
                    >
                      Padaria Doce Pão
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações
            </h3>

            <AvaliacaoModalButton
              estabelecimentoId={meiDetails.estabelecimentoId}
            />

            <div className="space-y-4">
              {reviews.length > 0 ? (
                <>
                  <div key={currentPage} className="space-y-4">
                    {paginatedReviews
                      .slice()
                      .reverse()
                      .map((review, index) => (
                        <div
                          key={review.avaliacoesId}
                          className={`
                          flex gap-4 py-2 items-start border bt-1px rounded-3xl shadow-lg
                          transition-all duration-500 ease-out
                          ${
                            animateReviews
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }
                        `}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 my-auto ml-4">
                            <Image
                              src="/avatars/default-avatar.png"
                              alt={`Avatar de ${review.usuario.nomeCompleto}`}
                              width={48}
                              height={48}
                              className="rounded-full w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {review.usuario.nomeCompleto}
                            </p>
                            <div className="flex items-center gap-1 my-1">
                              <StarRating rating={review.nota} />
                            </div>
                            <p className="text-gray-600 break-words">
                              {review.comentario}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pt-4 flex justify-end rounded-lg">
                      <Pagination>
                        <PaginationContent>
                          {[...Array(totalPages)].map((_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(pageNumber);
                                  }}
                                  isActive={currentPage === pageNumber}
                                  className={
                                    currentPage === pageNumber
                                      ? "bg-[#017DB9] text-white hover:bg-gradient-to-br from-[#017DB9] to-[#22c362]"
                                      : ""
                                  }
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">
                  Ainda não há avaliações para este local.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
