"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModernCarouselProps {
  images: string[];
  interval?: number; // tempo entre slides (ms)
}

export default function ModernCarousel({
  images,
  interval = 3000,
}: ModernCarouselProps) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => resetTimeout();
  }, [current, interval]);

  const goToSlide = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  const nextSlide = () =>
    setCurrent(current === images.length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-purple-600">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="min-w-full h-full relative flex-shrink-0"
          >
            <Image
              src={img}
              alt={`Slide ${idx + 1}`}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Indicadores (bolinhas) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === idx ? "bg-white" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full z-10"
      >
        <ChevronLeft className="w-5 h-5 text-purple-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full z-10"
      >
        <ChevronRight className="w-5 h-5 text-purple-700" />
      </button>
    </div>
  );
}
