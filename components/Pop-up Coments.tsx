"use client";

import { AnimatePresence, motion } from "framer-motion";
// 1. useEffect e Input (com TextArea) importados
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { contemPalavrao } from "@/lib/profanityFilter";
import { removeEmojis } from "@/lib/utils";
import { Input } from "antd"; // Importa o Input do Antd

const { TextArea } = Input; // Extrai o TextArea

// 2. Props do Botão atualizadas para aceitar parentId (opcional)
const AvaliacaoModalButton = ({
  estabelecimentoId,
  onReviewSubmit,
  parentId = null, // Define null como padrão
  children, // Adiciona children para texto customizado (ex: "Responder")
}: {
  estabelecimentoId: number;
  onReviewSubmit?: () => void;
  parentId?: number | null;
  children?: React.ReactNode; // Permite texto customizado no botão
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleButtonClick = () => {
    if (!user) {
      toast.error(
        "Para realizar um comentário, é necessário estar logado em uma conta."
      );
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="my-4 text-left mb-5">
      <button
        onClick={handleButtonClick}
        // 3. Renderiza o texto do children ou o padrão
        className="bg-gradient-to-br from-[#017DB9] to-[#22c362] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
      >
        {children || "Deixe aqui sua Avaliação"}
      </button>
      <SpringModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        estabelecimentoId={estabelecimentoId}
        parentId={parentId} // Passa o parentId para o modal
        onReviewSubmit={onReviewSubmit}
      />
    </div>
  );
};

// 4. Props do SpringModal atualizadas
interface SpringModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  estabelecimentoId: number;
  parentId: number | null; // <-- NOVO: Para saber se é uma resposta
  onReviewSubmit?: () => void;
}

const SpringModal = ({
  isOpen,
  setIsOpen,
  estabelecimentoId,
  parentId,
  onReviewSubmit,
}: SpringModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const isReply = parentId !== null; // Verifica se é uma resposta

  // 5. NOVO: Limpa o estado quando o modal fecha
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

  // 6. Lógica de envio ATUALIZADA
  const handleAvaliarClick = async () => {
    // Só exige nota se NÃO for uma resposta
    if (!isReply && rating === 0) {
      toast.warning("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (contemPalavrao(comment)) {
      toast.error("Você utilizou palavras inapropriadas.");
      return;
    }
    // Exige comentário em ambos os casos
    if (!comment.trim()) {
      toast.error("O comentário não pode estar vazio.");
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      nota: isReply ? null : rating, // Nota é null se for resposta
      comentario: comment,
      estabelecimentoId: estabelecimentoId, // Prop do MeideSaquá
      parent_id: parentId, // Novo campo para resposta
    };

    try {
      await submitReview(reviewData, user?.token ?? "");
      toast.success(isReply ? "Resposta enviada!" : "Avaliação enviada!");

      if (onReviewSubmit) {
        onReviewSubmit();
      }
      setIsOpen(false); // Fecha o modal
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            // 7. Estilo do gradiente ATUALIZADO
            className="bg-gradient-to-br from-[#017DB9] to-[#22c362] text-white p-6 w-full max-w-lg shadow-xl cursor-default relative overflow-hidden rounded-2xl"
          >
            <Star className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-4 rounded-full text-3xl text-blue-600 grid place-items-center mx-auto">
                <Star />
              </div>

              {/* 8. Título condicional */}
              <h3 className="text-center text-xl font-medium mb-4">
                {isReply ? "Responder ao comentário" : "Deixe sua avaliação"}
              </h3>

              {/* 9. Estrelas condicionais (só aparece se NÃO for resposta) */}
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

              {/* 10. TextArea do Ant Design */}
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
                // Use a classe CSS que vamos adicionar no globals.css
                className="review-textarea-dark w-full h-24 p-3 rounded-xl transition-all mb-2"
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
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
                  {/* 11. Texto do botão condicional */}
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

export default AvaliacaoModalButton;