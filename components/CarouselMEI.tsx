"use client";

import React, { useEffect } from "react";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const SwiperCarousel = () => {
  useEffect(() => {
    const swiper = new Swiper(".default-carousel", {
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: "#slider-button-right",
        prevEl: "#slider-button-left",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      loop: true,
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <div className="w-full relative">
      <div className="swiper default-carousel swiper-container rounded-3xl">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
              <span className="text-3xl font-semibold text-indigo-600">
                Slide 1
              </span>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
              <Image
                src="/foto-4k.jpg"
                alt="Slide 3"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="swiper-slide">
            <div className="relative w-full h-96 bg-indigo-50 rounded-2xl overflow-hidden">
              <Image
                src="/teste.jpg"
                alt="Slide 3"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        <div className="swiper-pagination"></div>

        {/* Botão Esquerdo */}
        <button
          id="slider-button-left"
          aria-label="Slide anterior"
          className="swiper-button-prev group flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-400 hover:bg-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 !absolute !left-2 !md:left-4 !top-1/2 -translate-y-1/2 z-10 text-gray-800 [&::after]:hidden"
        >
          <svg
            className="h-4 w-4 md:h-5 md:w-5 group-hover:text-gray-900 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Botão Direito */}
        <button
          id="slider-button-right"
          aria-label="Próximo slide"
          className="swiper-button-next group flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-400 hover:bg-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 !absolute !right-2 !md:right-4 !top-1/2 -translate-y-1/2 z-10 text-gray-800 [&::after]:hidden"
        >
          <svg
            className="h-4 w-4 md:h-5 md:w-5 group-hover:text-gray-900 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SwiperCarousel;
