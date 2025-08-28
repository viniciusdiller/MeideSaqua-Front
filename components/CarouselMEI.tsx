"use client"; // Necessário se estiver usando o App Router do Next.js

import React, { useEffect } from "react";

// Importe os módulos do Swiper que você precisa
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const SwiperCarousel = () => {
  useEffect(() => {
    // Inicializa o Swiper dentro do useEffect para garantir que o DOM foi carregado
    const swiper = new Swiper(".default-carousel", {
      // Configure os módulos
      modules: [Navigation, Pagination],

      // Opções de navegação (setas)
      navigation: {
        nextEl: "#slider-button-right",
        prevEl: "#slider-button-left",
      },

      // Opções de paginação (bolinhas)
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      // Outras opções que você pode querer
      loop: true, // Para o carrossel girar em loop
    });

    // É uma boa prática destruir a instância do Swiper quando o componente for desmontado
    return () => {
      swiper.destroy();
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  return (
    <div className="w-full relative">
      <div className="swiper default-carousel swiper-container">
        <div className="swiper-wrapper">
          {/* Slide 1 */}
          <div className="swiper-slide">
            <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
              <span className="text-3xl font-semibold text-indigo-600">
                Slide 1
              </span>
            </div>
          </div>
          {/* Slide 2 */}
          <div className="swiper-slide">
            <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
              <span className="text-3xl font-semibold text-indigo-600">
                Slide 2
              </span>
            </div>
          </div>
          {/* Slide 3 */}
          <div className="swiper-slide">
            <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
              <Image
                src="/gatinho.jpg"
                alt="Slide 3"
                fill
                style={{ objectFit: "cover" }}
              />
              <span className="text-3xl font-semibold text-indigo-600"></span>
            </div>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="flex items-center gap-8 lg:justify-start justify-center">
          <button
            id="slider-button-left"
            className="swiper-button-prev group !p-2 flex justify-center items-center border border-solid border-indigo-600 !w-12 !h-12 transition-all duration-500 rounded-full !top-2/4 !-translate-y-8 !left-5 hover:bg-indigo-600"
          >
            <svg
              className="h-5 w-5 text-indigo-600 group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
                stroke="currentColor"
                strokeWidth="1.6" // Convertido de stroke-width
                strokeLinecap="round" // Convertido de stroke-linecap
                strokeLinejoin="round" // Convertido de stroke-linejoin
              />
            </svg>
          </button>
          <button
            id="slider-button-right"
            className="swiper-button-next group !p-2 flex justify-center items-center border border-solid border-indigo-600 !w-12 !h-12 transition-all duration-500 rounded-full !top-2/4 !-translate-y-8 !right-5 hover:bg-indigo-600"
          >
            <svg
              className="h-5 w-5 text-indigo-600 group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.99984 4.00012L10 8.00029L5.99748 12.0028"
                stroke="currentColor"
                strokeWidth="1.6" // Convertido de stroke-width
                strokeLinecap="round" // Convertido de stroke-linecap
                strokeLinejoin="round" // Convertido de stroke-linejoin
              />
            </svg>
          </button>
        </div>

        {/* Paginação */}
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
};

export default SwiperCarousel;
