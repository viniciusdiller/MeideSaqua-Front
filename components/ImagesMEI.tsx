"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Item {
  id: string;
  img: string;
}

interface ImageGridProps {
  items: Item[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ items }) => {
  // Mudamos para guardar o ÍNDICE (número) da imagem clicada
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Filtra itens válidos
  const validItems = Array.isArray(items) ? items.filter((item) => item && item.img) : [];
  
  // Limita a 4 apenas para a exibição na grade
  const displayedItems = validItems.slice(0, 4);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {displayedItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-lg group"
            onClick={() => setSelectedIndex(index)} // Salva o índice ao clicar
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            layoutId={`card-${item.id}`}
          >
            <Image
              src={item.img}
              alt={`Imagem do portfólio ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Efeito de hover opcional */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && validItems.length > 0 && (
          <ImageModal
            items={validItems}
            initialIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ImageModalProps {
  items: Item[];
  initialIndex: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ items, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Navegar para a próxima (circular)
  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // Navegar para a anterior (circular)
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Controles de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  const currentItem = items[currentIndex];

  if (!currentItem) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Botão Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-transform transform hover:scale-110"
        aria-label="Fechar modal"
      >
        <X size={24} />
      </button>

      {/* Seta Esquerda (Anterior) - Só mostra se houver mais de 1 foto */}
      {items.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 z-[60] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-transform hover:scale-110"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Seta Direita (Próxima) - Só mostra se houver mais de 1 foto */}
      {items.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-[60] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-transform hover:scale-110"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Container da Imagem */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
        key={currentIndex} // A chave força o Framer Motion a detectar a mudança
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <img
          src={currentItem.img}
          alt={`Visualização ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
        />
      </motion.div>

      {/* Contador (Opcional) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {items.length}
      </div>
    </motion.div>
  );
};

export default ImageGrid;