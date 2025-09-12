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
      <div className="swiper default-carousel swiper-container rounded-3xl">
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
                src="/teste.jpg"
                alt="Slide 3"
                fill
                className="object-cover" // Você pode adicionar object-top, object-center, etc. aqui
                sizes="(max-width: 768px) 100vw, 50vw" // Exemplo: 100% em mobile, 50% em telas maiores
                priority // Adicione se a imagem for a primeira a ser vista na página (LCP)
                placeholder="blur" // Opcional: Efeito de blur enquanto carrega
                blurDataURL="/path/to/tiny/placeholder.jpg" // Opcional: uma imagem minúscula para o blur
              />
            </div>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="flex items-center gap-8 lg:justify-start justify-center">
          <button
            id="slider-button-left"
            aria-label="Slide anterior" // Boa prática para acessibilidade
            className="swiper-button-prev group 
             relative // Garante que o ícone interno seja posicionado corretamente se for necessário
             flex items-center justify-center 
             w-8 h-8 md:w-10 md:h-10 // Botão menor em telas pequenas, um pouco maior em md
             rounded-full // Continua redondo
             bg-gray-400 // Cor de fundo cinza principal
             hover:bg-white // Background branco no hover
             transition-all duration-300 ease-in-out // Transição suave
             focus:outline-none focus:ring-2 focus:ring-gray-300 // Foco acessível
             !absolute // Mantém a posição absoluta para o Swiper
             left-2 md:left-4 // Posição mais próxima da borda
             z-10 // Garante que esteja acima do slide
             "
            // Para centralizar verticalmente, precisamos da mesma técnica de 'top: 50%' e 'translateY(-50%)'
            // que aplicamos antes no componente pai do botão, ou diretamente no botão se ele for absoluto no container do Swiper.
            // Se ele já estiver dentro de um div com 'absolute inset-y-0 flex items-center', então está ok.
            // Se não, adicione o style inline como abaixo:
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <svg
              className="h-4 w-4 md:h-5 md:w-5 // Tamanho do ícone menor
               text-gray-800 // Cor da seta cinza escuro
               group-hover:text-gray-900 // Seta escurece um pouco no hover
               transition-colors duration-300 // Transição suave para a cor da seta
               "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12m7.5 0l-7.5-7.5"
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
