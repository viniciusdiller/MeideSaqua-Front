"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModernCarouselProps {
  slides: {
    imageUrl: string;
    label: string;
  }[];
  interval?: number;
}

export default function ModernCarousel({
  slides,
  interval = 5000,
}: ModernCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => resetTimeout();
  }, [current, interval]);

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage("");
  };

  const goToSlide = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-blue-600">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="min-w-full h-full relative flex-shrink-0">
            <Image
              src={slide.imageUrl}
              alt={`Slide ${idx + 1}`}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
              priority={idx === 0}
            />
            {/* Botão por slide */}
            <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 w-auto text-center">
              <button
                onClick={() => openModal(slide.imageUrl)}
                className="rounded-2xl border-2 border-dashed border-blue-600 bg-[rgba(255,255,255,0.2)] px-4 py-2 font-bold uppercase
                text-white transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md
                hover:shadow-[4px_4px_16px_rgba(0,0,0,0.4)] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl
                active:shadow-none backdrop-blur-lg text-sm whitespace-nowrap"
            >
                {slide.label}
            </button>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === idx ? "bg-white" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>

      {/* Setas */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full z-10"
      >
        <ChevronLeft className="w-5 h-5 text-blue-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full z-10"
      >
        <ChevronRight className="w-5 h-5 text-blue-700" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={modalImage}
                alt="Imagem em destaque"
                fill
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
