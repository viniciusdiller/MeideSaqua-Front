"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  PhoneForwarded,
  Instagram,
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
  formatarDataParaMesAno,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SearchX, CalendarDays } from "lucide-react";
import FormattedDescription from "@/components/FormattedDescription";

const CustomStarIcon = ({
  fillPercentage = "100%",
}: {
  fillPercentage?: string;
}) => {
  const uniqueId = `grad-${Math.random()}`;
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-400"
    >
      <defs>
        <linearGradient id={uniqueId}>
          <stop offset="0%" stopColor="currentColor" />
          <stop offset={fillPercentage} stopColor="currentColor" />
          <stop
            offset={fillPercentage}
            stopColor="transparent"
            stopOpacity="1"
          />
        </linearGradient>
      </defs>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={`url(#${uniqueId})`}
        stroke="currentColor"
      />
    </svg>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        let fillPercentage = "0%";
        if (starValue <= rating) {
          fillPercentage = "100%";
        } else if (starValue - 1 < rating && starValue > rating) {
          fillPercentage = `${(rating - index) * 100}%`;
        }

        return <CustomStarIcon key={index} fillPercentage={fillPercentage} />;
      })}
    </div>
  );
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const normalizeImagePath = (filePath: string) => {
  if (!filePath) return "";
  let normalized = filePath.replace(/\\/g, "/");

  const uploadsIndex = normalized.indexOf("uploads/");
  if (uploadsIndex !== -1) {
    normalized = normalized.substring(uploadsIndex);
  }

  if (normalized.startsWith("/")) {
    normalized = normalized.substring(1);
  }

  return normalized;
};

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]);

  const fetchMeiData = async () => {
    const meiId = params.slug;

    if (!meiId) return;

    try {
      const detailsData = await getEstablishmentById(meiId);
      const reviewsData = await getReviewsByEstablishment(meiId);

      setMeiDetails(detailsData);
      setReviews(reviewsData);
      setRating(detailsData.media || 0);
      if (detailsData.produtosImg && Array.isArray(detailsData.produtosImg)) {
        const portfolioItems = detailsData.produtosImg.map(
          (image: any, index: number) => {
            const normalizedUrl = normalizeImagePath(image.url);
            return {
              id: `${detailsData.estabelecimentoId}-${index}`,
              img: `${API_URL}/${normalizedUrl}`,
            };
          }
        );

        setPortfolioImages(portfolioItems);
      } else {
        setPortfolioImages([]);
      }

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <Loader2 className="mx-auto h-16 w-16 text-blue-600 animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            A carregar dados do MEI...
          </h1>
          <p className="text-gray-600">
            A preparar os detalhes para si. Por favor, aguarde um momento.
          </p>
        </div>
      </div>
    );
  }

  if (!meiDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Estabelecimento Não Encontrado
          </h2>
          <p className="text-gray-600 mb-6 max-w-sm">
            O MEI que você está procurando não existe, foi removido ou o link
            está incorreto.
          </p>
          <Button
            asChild
            className="rounded-full px-6 hover:cursor-pointer hover:text-white bg-gradient-to-br from-[#017DB9] to-[#22c362] text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
          >
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
        </div>
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

  const handleDeleteClick = (avaliacaoId: number) => {
    if (!user?.token) {
      toast.error("Você precisa estar logado para excluir um comentário.");
      return;
    }
    setReviewToDelete(avaliacaoId);
    setIsDeleteDialogOpen(true);
  };

  // Função que executa a exclusão após a confirmação
  const handleConfirmDelete = async () => {
    if (!reviewToDelete || !user?.token) {
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      await deleteReview(reviewToDelete, user.token);
      toast.success("Comentário excluído com sucesso!");
      setReviews(reviews.filter((r) => r.avaliacoesId !== reviewToDelete));
    } catch (error: any) {
      console.error("Erro ao excluir avaliação:", error);
      toast.error(error.message || "Não foi possível excluir o comentário.");
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const linhasVisiveis = 3;
  const colunas = 4;
  const limite = linhasVisiveis * colunas;

  const areasAtuacaoString = meiDetails.areasAtuacao || "";

  const areasAtuacaoList: string[] = areasAtuacaoString
    ? (areasAtuacaoString as string)
        .split(",")
        .map((area) => area.trim())
        .filter((area) => area.length > 0)
    : [];

  let areasVisiveis = areasAtuacaoList;

  if (!locaisExpandidos && areasAtuacaoList.length > limite) {
    areasVisiveis = areasAtuacaoList.slice(0, limite - 1);
    areasVisiveis.push("SHOW_MORE_BUTTON");
  }

  const tagsInvisiveisString = meiDetails.tagsInvisiveis || "";

  const tagsList: string[] = tagsInvisiveisString
    ? (tagsInvisiveisString as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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
                    {meiDetails.createdAt && (
                      <div className="hidden sm:flex items-center text-sm text-gray-500 border-l-2 border-gray-300 pl-4">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span>
                          Membro desde{" "}
                          {formatarDataParaMesAno(meiDetails.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  {meiDetails.createdAt && (
                    <div className="flex items-center text-sm text-gray-500 border-l-2 border-gray-300 pl-4 mt-4 sm:hidden">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>
                        Membro desde
                        {formatarDataParaMesAno(meiDetails.createdAt)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed md:pl-2">
                  <FormattedDescription text={meiDetails.descricao} />
                </p>
                <div className="hidden quinhentos:flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6">
                  <div className="flex items-center gap-6 ">
                    <a
                      href={meiDetails.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors hover:cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                        <Instagram size={18} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                    <a
                      href={`https://wa.me/55${meiDetails.contatoEstabelecimento.replace(
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
                    <TagsAnimate tags={tagsList} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center md:col-span-1">
                <div className="max-w-48 mas-h-48 md:max-w-56 md:max-h-56 desktop:max-h-64 desktop:max-w-64 bg-white rounded-2xl flex items-center justify-center p-4">
                  <TiltImage
                    src={
                      (meiDetails.logoUrl &&
                        `${API_URL}/${normalizeImagePath(
                          meiDetails.logoUrl
                        )}`) ||
                      "/LogoExploraMonocromática.png"
                    }
                    alt={`Logo de ${meiDetails.nomeFantasia}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="quinhentos:hidden flex flex-col items-center justify-center gap-6 mt-6 col-span-full">
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
                <div className="flex flex-wrap justify-center gap-2">
                  <TagsAnimate tags={tagsList} />
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
              <ImageGrid items={portfolioImages} />
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
                    {areasVisiveis.map((area, index) =>
                      area === "SHOW_MORE_BUTTON" ? (
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
                          {area}
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
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800 ">
                                  {review.usuario.nomeCompleto}
                                  {user &&
                                    user.usuarioId === review.usuarioId && (
                                      <button
                                        // Altere esta linha
                                        onClick={() =>
                                          handleDeleteClick(review.avaliacoesId)
                                        }
                                        className="ml-3 text-sm text-red-500 hover:text-red-700"
                                        aria-label="Excluir seu comentário"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                </p>
                              </div>
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
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente o seu comentário.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setReviewToDelete(null)}
                      className="rounded-full border-2 border-gray-300 hover:border-gray-400 transition-all transform hover:scale-105 active:scale-95 px-4 py-2"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmDelete}
                      asChild
                      className="rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-105 active:scale-95 px-4 py-2"
                    >
                      <button>Sim, excluir</button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </AnimatedSection>
        </div>
      </motion.main>
    </div>
  );
}
