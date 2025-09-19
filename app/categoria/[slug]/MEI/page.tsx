"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  PhoneForwarded,
  Instagram,
  Palette,
  Brush,
  Store,
  Wrench,
  PartyPopper,
  Utensils,
  HeartPulse,
  Briefcase,
  Car,
  Laptop,
  Plane,
  Tractor,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { TiltImage } from "@/components/ui/TiltImage";
import "leaflet/dist/leaflet.css";
import { categories } from "@/app/page";
import Image from "next/image";
import {
  getEstablishmentById,
  getReviewsByEstablishment,
  deleteReview,
} from "@/lib/api";
import AvaliacaoModalButton from "@/components/Pop-up Coments";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { motion, useInView } from "framer-motion";
import TagsAnimate from "@/components/ui/tagsanimate";
import ImageGrid from "@/components/ImagesMEI";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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

const item = [
  {
    id: "1",
    img: "/foto-4k.jpg",
    src: "/foto-4k.jpg",
    url: "/foto-4k.jpg",
    alt: "Imagem 1",
    height: 300,
  },
  {
    id: "2",
    img: "/teste.jpg",
    url: "/teste.jpg",
    alt: "Imagem 2",
    height: 300,
  },
  {
    id: "3",
    img: "/gatinho.jpg",
    url: "/gatinho.jpg",
    alt: "Imagem 3",
    height: 300,
  },
  {
    id: "4",
    img: "/gatooculos.jpg",
    url: "/gatooculos.jpg",
    alt: "Imagem 3",
    height: 300,
  },
];

const REVIEWS_PER_PAGE = 4;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export default function MeiDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [meiDetails, setMeiDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateReviews, setAnimateReviews] = useState(false);
  const [locaisExpandidos, setLocaisExpandidos] = useState(false);
  const { user } = useAuth();

  const fetchMeiData = async () => {
    const meiId = params.slug;
    if (!meiId) return;

    try {
      const detailsData = await getEstablishmentById(meiId);
      const reviewsData = await getReviewsByEstablishment(meiId);

      setMeiDetails(detailsData);
      setReviews(reviewsData);
      setRating(detailsData.media || 0);
      setAnimateReviews(true);
    } catch (error) {
      console.error("Falha ao buscar dados do MEI:", error);
      setMeiDetails(null);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchMeiData();
      setIsLoading(false);
    };
    initialFetch();
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

  const handleDelete = async (avaliacaoId: number) => {
    if (!user?.token) {
      toast.error("Você precisa estar logado para excluir um comentário.");
      return;
    }

    if (
      confirm(
        "Tem certeza que deseja excluir seu comentário? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteReview(avaliacaoId, user.token);
        toast.success("Comentário excluído com sucesso!");
        // Atualiza a lista de reviews no estado, removendo o que foi excluído
        setReviews(reviews.filter((r) => r.avaliacoesId !== avaliacaoId));
      } catch (error: any) {
        console.error("Erro ao excluir avaliação:", error);
        toast.error(error.message || "Não foi possível excluir o comentário.");
      }
    }
  };

  const locais = [
    "Padaria Doce Pão",
    "Restaurante Central",
    "Padaria Doce Pão pao pao pao pao",
    "Farmácia Vida",
    "Lanchonete Express",
    "Barra Nova",
    "Vilatur",
    "Porto da Roça II",
    "Itaúna",
    "Restaurante Central",
    "Padaria Doce Pão",
    "Padaria Doce Pão",
    "Restaurante Central",
    "Padaria Doce Pão pao pao pao pao",
    "Farmácia Vida",
    "Lanchonete Express",
    "Barra Nova",
    "Vilatur",
    "Porto da Roça II",
    "Itaúna",
    "Restaurante Central",
    "Padaria Doce Pão",
  ];

  const linhasVisiveis = 3;
  const colunas = 4;
  const limite = linhasVisiveis * colunas;

  let locaisVisiveis = locais;
  if (!locaisExpandidos && locais.length > limite) {
    locaisVisiveis = locais.slice(0, limite - 1);
    locaisVisiveis.push("SHOW_MORE_BUTTON");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#017DB9] to-[#22c362]">
      <motion.header
        className="sticky top-0 z-20"
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/80">
          <div className="w-full px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center">
            <Link
              href={`/categoria/${categorySlug}`}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#017DB9] transition-colors p-2 -ml-3 sm:ml-8 md:ml-12 lg:ml-36 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Voltar</span>
            </Link>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-md font-semibold text-gray-800 truncate ml-3 break-words max-w-[60%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[40%]">
              {meiDetails.nomeFantasia}
            </h1>
          </div>
        </div>
      </motion.header>

      <motion.main
        className="w-full p-4 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <div className="space-y-8">
          <motion.section
            className="bg-white p-6 rounded-3xl shadow-lg md:mx-auto md:max-w-[85%]"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 flex flex-col">
                <div className="mb-6 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-[#017DB9] pl-3">
                    {meiDetails.nomeFantasia}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <StarRating rating={rating} />
                    <span className="text-gray-700 font-semibold">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({reviews.length} avaliações)
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed md:pl-2">
                  {meiDetails.descricao}
                </p>
                <div className="hidden quinhentos:flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6">
                  <div className="flex items-center gap-6">
                    <a
                      href={meiDetails.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                        <Instagram size={18} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                    <a
                      href={`https://wa.me/${meiDetails.contatoEstabelecimento.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-[#22c362] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <PhoneForwarded size={18} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">WhatsApp</span>
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TagsAnimate />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center md:col-span-1">
                <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center p-4">
                  <TiltImage
                    src={meiDetails.logoUrl || "/placeholder-logo.png"}
                    alt={`Logo de ${meiDetails.nomeFantasia}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="bg-white p-6 rounded-3xl shadow-lg md:mx-auto md:max-w-[85%] space-y-6"
            variants={itemVariants}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 border-l-4 border-[#017DB9] pl-3">
                Portfólio
              </h3>
              <p className="text-sm text-gray-600">
                Clique em uma imagem para visualizar em tamanho completo
              </p>
            </div>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200">
              <ImageGrid items={item} />
            </div>
          </motion.section>

          <AnimatedSection>
            <div className="bg-white p-6 rounded-3xl shadow-lg md:mx-auto md:max-w-[85%] grid grid-cols-1 milecem:grid-cols-4 gap-8">
              <div className="space-y-5 text-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-[#017DB9] pl-3">
                  Área de Atuação
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#017DB9]" />
                  </div>
                  <span className="leading-relaxed">{meiDetails.endereco}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span>{meiDetails.contatoEstabelecimento}</span>
                </div>
              </div>
              <div className="w-full h-fit bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden milecem:col-span-3">
                <div className="p-5 md:p-8 text-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {locaisVisiveis.map((local, index) =>
                      local === "SHOW_MORE_BUTTON" ? (
                        <button
                          key={index}
                          onClick={() => setLocaisExpandidos(true)}
                          className="px-3 py-2 rounded-xl border border-[#017DB9] bg-blue-50 text-[#017DB9] font-medium flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md hover:-translate-y-1"
                        >
                          Ver Todos
                        </button>
                      ) : (
                        <div
                          key={index}
                          className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm flex items-center justify-center text-sm font-medium hover:cursor-default"
                        >
                          {local}
                        </div>
                      )
                    )}
                    {locaisExpandidos && (
                      <button
                        onClick={() => setLocaisExpandidos(false)}
                        className="px-3 py-2 rounded-xl border border-[#017DB9] bg-blue-50 text-[#017DB9] font-medium flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md hover:-translate-y-1 col-span-full"
                      >
                        Ver Menos
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#017DB9] pl-3">
                Avaliações
              </h3>
              <AvaliacaoModalButton
                estabelecimentoId={meiDetails.estabelecimentoId}
                onReviewSubmit={fetchMeiData}
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
                            className={`flex gap-4 py-2 items-start border bt-1px rounded-3xl shadow-lg transition-all duration-500 ease-out ${
                              animateReviews
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                            }`}
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
                              {user &&
                                user.usuarioId === review.usuario.usuarioId && (
                                  <button
                                    onClick={() =>
                                      handleDelete(review.avaliacoesId)
                                    }
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                    aria-label="Deletar comentário"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
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
            </div>
          </AnimatedSection>
        </div>
      </motion.main>
    </div>
  );
}
