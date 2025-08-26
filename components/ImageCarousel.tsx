"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Using icons for a cleaner look

const slides = [
  { src: "/saquarema.png", alt: "Vista de Saquarema" },
  { src: "/gatinho.jpg", alt: "A cute cat" },
  { src: "/saquarema.png", alt: "Another view of Saquarema" },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resets the auto-play timer
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Changed to 5 seconds for a better rhythm

    return () => resetTimeout();
  }, [current]);

  const prevSlide = () => {
    resetTimeout();
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    resetTimeout();
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  return (
    // 'group' allows child elements to change style on hover (e.g., making arrows visible)
    // 'aspect-video' creates a responsive 16:9 horizontal shape
    <div className="relative group w-[90%] max-w-6xl mx-auto h-[200px] md:h-[270px] overflow-hidden rounded-3xl shadow-xl">
      <div className="w-full h-full flex transition-transform ease-out duration-500">
        {/* Render all images, but only the active one is visible. This allows for smooth transitions. */}
        {slides.map((slide, i) => (
          <Image
            key={i}
            src={slide.src}
            alt={slide.alt}
            fill
            style={{ objectFit: "cover" }}
            className={`transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0} // Only prioritize the first image for initial load
          />
        ))}
      </div>

      {/* A softer gradient mask that blends with a light gray/white background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-100/20 via-transparent to-transparent" />

      {/* Navigation Arrows - hidden by default, appear on group hover */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/60 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/60 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      {/* Indicator Dots - also hidden by default */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              resetTimeout();
              setCurrent(i);
            }}
            className={`w-2.5 h-2.5 rounded-full ring-1 ring-white/50 transition-all duration-300 ${
              current === i ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
