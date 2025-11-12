// components/AvaliacaoModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState, useEffect } from "react"; // <-- Importar useEffect
import { Star } from "lucide-react";
import { submitReview } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { contemPalavrao } from "@/lib/profanityFilter";
import { removeEmojis } from "@/lib/utils"; // (assumindo que 'utils' exporta 'removeEmojis')
import TextArea from "antd/es/input/TextArea";

// <-- MODIFICADO: Props do Modal controlado
interface SpringModalProps {
  isOpen: boolean;
  onClose: () => void;
  estabelecimentoId: number;
  parentId: number | null; // <-- NOVO: Para saber se é uma resposta
  onReviewSubmit: () => void;
}

const AvaliacaoModal = ({
  isOpen,
  onClose,
  estabelecimentoId,
  parentId,
  onReviewSubmit,
}: SpringModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // <-- NOVO: Limpa o estado quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valueComEmoji = e.target.value;
    const valueSemEmoji = removeEmojis(valueComEmoji);

    if (valueComEmoji !== valueSemEmoji) {
      toast.error("Não é possível adicionar emojis", {
        id: "emoji-error-toast",
      });
    }
    setComment(valueSemEmoji);
  };

  const handleAvaliarClick = async () => {
    // <-- MODIFICADO: Só exige nota se NÃO for uma resposta
    if (!parentId && rating === 0) {
      toast.warning("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (contemPalavrao(comment)) {
      toast.error("Você utilizou palavras inapropriadas.");
      return;
    }
    if (!comment.trim()) {
      toast.error("O comentário não pode estar vazio.");
      return;
    }

    setIsSubmitting(true);

    // <-- MODIFICADO: Estrutura dos dados enviados para a API
    const reviewData = {
      nota: parentId ? null : rating, // Nota é null se for resposta
      comentario: comment,
      estabelecimentoId: estabelecimentoId, // Enviado no nível raiz
      parent_id: parentId, // Enviado no nível raiz
    };

    try {
      await submitReview(reviewData, user?.token ?? "");
      toast.success(parentId ? "Resposta enviada!" : "Avaliação enviada!");

      if (onReviewSubmit) {
        onReviewSubmit(); // Isso vai fechar o modal e recarregar os dados na página
      }
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      toast.error(
        error.message ||
          "Erro ao enviar. Verifique se você já avaliou este local."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReply = parentId !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // <-- MODIFICADO
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#017DB9] to-[#22c362] text-white p-6 w-full max-w-lg shadow-xl cursor-default relative overflow-hidden rounded-2xl"
          >
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-4 rounded-full text-3xl text-blue-600 grid place-items-center mx-auto">
                <Star />
              </div>

              <h3 className="text-center text-xl font-medium mb-4">
                {isReply ? "Responder ao comentário" : "Deixe sua avaliação"}
              </h3>

              {!isReply && (
                <div
                  className="flex justify-center gap-2 mb-4"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star
                      key={index}
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHoverRating(index)}
                      className={`cursor-pointer transition-colors text-3xl ${
                        (hoverRating || rating) >= index
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}

              <TextArea
                showCount
                maxLength={250}
                placeholder={
                  isReply
                    ? "Digite sua resposta..."
                    : "Digite aqui seu comentário..."
                }
                value={comment}
                onChange={handleCommentChange}
                className="review-textarea-dark w-full h-24 p-3 rounded-xl transition-all mb-2"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={onClose}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                  disabled={isSubmitting}
                >
                  Voltar
                </button>
                <button
                  onClick={handleAvaliarClick}
                  className="bg-white hover:opacity-90 transition-opacity text-blue-600 font-semibold w-full py-2 rounded disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Enviando..."
                    : isReply
                    ? "Responder"
                    : "Avaliar"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvaliacaoModal;
