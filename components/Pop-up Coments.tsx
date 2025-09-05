"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/api"; // Importa a função da API
import { useAuth } from "@/context/AuthContext"; // Importa o hook de autenticação
import { toast } from "sonner"; // Importa o sistema de notificações

// O componente do botão agora precisa saber qual estabelecimento está sendo avaliado
const AvaliacaoModalButton = ({
  estabelecimentoId,
}: {
  estabelecimentoId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Pega o usuário para saber se está logado

  // Só mostra o botão de avaliação se o usuário estiver logado
  if (!user) {
    return null;
  }

  return (
    <div className="my-4">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-orange-500 text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
      >
        Deixe aqui sua Avaliação
      </button>
      <SpringModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        estabelecimentoId={estabelecimentoId}
      />
    </div>
  );
};

const SpringModal = ({
  isOpen,
  setIsOpen,
  estabelecimentoId, // Recebe o ID do estabelecimento
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  estabelecimentoId: number;
}) => {
  const { user } = useAuth(); // Pega o usuário para obter o token
  const [rating, setRating] = useState(0); // Estado para a nota
  const [hoverRating, setHoverRating] = useState(0); // Estado para o hover
  const [comment, setComment] = useState(""); // Estado para o comentário
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de loading

  const handleAvaliarClick = async () => {
    // Validações
    if (!user || !user.token) {
      toast.error("Você precisa estar logado para fazer uma avaliação.");
      return;
    }
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setIsSubmitting(true);

    // Objeto de dados para a API
    const reviewData = {
      nota: rating,
      comentario: comment,
      estabelecimento: {
        estabelecimentoId: estabelecimentoId,
      },
      // O backend identificará o usuário pelo token
    };

    try {
      // Chama a função da API
      await submitReview(reviewData, user.token);

      toast.success("Avaliação enviada com sucesso!");

      setIsOpen(false);
      // Limpa os campos após o envio
      setRating(0);
      setComment("");

      // Opcional: Recarrega a página para mostrar a nova avaliação
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar sua avaliação. Tente novamente.");
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
            className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 w-full max-w-lg shadow-xl cursor-default relative overflow-hidden rounded-2xl"
          >
            <Star className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-4 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <Star />
              </div>

              {/* Sistema de Estrelas Interativo */}
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

              <textarea
                placeholder="Digite aqui seu comentário..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-24 p-3 rounded-xl bg-slate-800/50 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
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
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Avaliar"}
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
