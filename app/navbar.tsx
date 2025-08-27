"use client";

import { MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Instagram, Globe } from "lucide-react";

// (O código do VARIANTS e do AnimatedHamburgerButton continua o mesmo...)
// VARIANTS para a animação do botão
const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};

// Componente do botão animado
type AnimatedHamburgerButtonProps = {
  active: boolean;
  onClick: () => void;
};

const AnimatedHamburgerButton = ({
  active,
  onClick,
}: AnimatedHamburgerButtonProps) => {
  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={onClick}
        className="relative h-12 w-12 transition-colors focus:outline-none z-50"
        aria-label="Abrir menu"
      >
        <motion.span
          variants={VARIANTS.top}
          className="absolute h-1 w-6 bg-gray-700"
          style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
        />
        <motion.span
          variants={VARIANTS.middle}
          className="absolute h-1 w-6 bg-gray-700"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          variants={VARIANTS.bottom}
          className="absolute h-1 w-3 bg-gray-700"
          style={{
            x: "-50%",
            y: "50%",
            bottom: "35%",
            left: "calc(50% + 6px)",
          }}
        />
      </motion.button>
    </MotionConfig>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-md">
      {/* MUDANÇA: 'justify-between' agora organiza os grupos de desktop */}
      <div className="relative container mx-auto px-4 py-1 sm:py-1 md:py-1 flex items-center justify-between">
        {/* GRUPO ESQUERDA: Logo + Navegação (Aparece apenas no desktop) */}
        <div className="hidden teste:flex items-center gap-10">
          <Link
            href="https://www.saquarema.rj.gov.br/"
            aria-label="Página da Prefeitura de Saquarema"
          >
            <Image
              src="/logo2sq.png"
              alt="Logo Prefeitura de Saquarema"
              width={2660}
              height={898}
              className="block w-auto h-12" // Tamanho fixo para desktop
            />
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#017DB9] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-[#017DB9] transition-colors"
            >
              Sobre o Projeto
            </Link>
            <Link
              href="/contato"
              className="text-gray-700 hover:text-[#017DB9] transition-colors"
            >
              Contato
            </Link>
          </nav>
        </div>

        {/* LOGO CENTRALIZADO (Aparece apenas no mobile) */}
        <div className="teste:hidden w-full">
          <Link href="/" aria-label="Página Inicial">
            <Image
              src="/logo2sq.png"
              alt="Logo Prefeitura de Saquarema"
              width={2660}
              height={898}
              className="block mx-auto w-auto h-10 sm:h-14"
            />
          </Link>
        </div>

        {/* GRUPO DIREITA: Ícones Sociais (Aparece apenas no desktop) */}
        <div className="hidden teste:flex items-center space-x-4">
          <a
            href="https://www.instagram.com/prefeiturasaquarema/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <Instagram size={24} strokeWidth={2} />
          </a>
          <a
            href="https://www.saquarema.rj.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-700 transition-colors"
          >
            <Globe size={24} strokeWidth={2} />
          </a>
        </div>

        {/* Botão de Menu (Aparece apenas no mobile, posicionado de forma absoluta) */}
        <div className="teste:hidden absolute right-4 top-1/2 -translate-y-1/2">
          <AnimatedHamburgerButton
            active={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="teste:hidden absolute top-full left-0 w-full bg-white border-t border-blue-100 shadow-xl py-4 z-40 rounded-b-lg animate-slide-down">
          <nav className="flex flex-col space-y-4 px-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#017DB9] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-[#017DB9] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sobre o Projeto
            </Link>
            <Link
              href="/contato"
              className="text-gray-700 hover:text-[#017DB9] transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
            <a
              href="https://www.instagram.com/prefeiturasaquarema/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <Instagram size={20} />
              Instagram
            </a>
            <a
              href="https://www.saquarema.rj.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-700 transition-colors"
            >
              <Globe size={20} />
              Site da Prefeitura
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
