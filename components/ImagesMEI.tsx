"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";


interface Item {
  id: string;
  img: string;
}

interface ImageGridProps {
  items: Item[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const displayedItems = items.slice(0, 4);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {displayedItems.map((item) => (
          <motion.div
            key={item.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-lg"
            onClick={() => setSelectedImage(item.img)}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            layoutId={`card-${item.id}`} // Animação suave para o modal
          >
            <Image
              src={item.img}
              alt={`Imagem do portfólio ${item.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            src={selectedImage}
            onClose={() => setSelectedImage(null)}
            layoutId={`card-${selectedImage}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


interface ImageModalProps {
  src: string;
  onClose: () => void;
  layoutId: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose, layoutId }) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative p-4"
        onClick={(e) => e.stopPropagation()}
        layoutId={layoutId} 
      >
        <img
          src={src}
          alt="Visualização da imagem ampliada"
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 bg-white rounded-full p-1.5 text-black hover:bg-gray-200 transition-transform transform hover:scale-110"
          aria-label="Fechar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ImageGrid;