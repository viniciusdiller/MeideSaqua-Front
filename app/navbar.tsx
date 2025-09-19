"use client";

import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, ReactElement } from "react";
import Link from "next/link";
import {
  Instagram,
  Globe,
  LogIn,
  User as UserIcon,
  LogOut,
  MessageCircleQuestion,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AnimatedLogo = () => {
  const logos = [
    { 
      src: "/LogoMeideSaqua.png", 
      alt: "Logo MeideSaqua", 
      className: "h-10 w-auto" 
    },
    { 
      src: "/logo2sq.png", 
      alt: "Logo Prefeitura de Saquarema", 
      className: "h-12 w-auto" 
    },
    {
      src: "/logoSMGS.png",
      alt:"Logo Secretaria Municipal de Governança e Sustentabilidade",
      className: "h-12 w-auto"
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 5000); // Alterna a cada 3 segundos

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div className="relative h-16 w-48 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={logos[index].src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute"
        >
          <Image
            src={logos[index].src}
            alt={logos[index].alt}
            width={160}
            height={48}
            className={`object-contain ${logos[index].className}`}
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const VARIANTS = {
  top: {
    open: { rotate: ["0deg", "0deg", "45deg"], top: ["35%", "50%", "50%"] },
    closed: { rotate: ["45deg", "0deg", "0deg"], top: ["50%", "50%", "35%"] },
  },
  middle: {
    open: { rotate: ["0deg", "0deg", "-45deg"] },
    closed: { rotate: ["-45deg", "0deg", "0deg"] },
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

type AnimatedHamburgerButtonProps = {
  active: boolean;
  onClick: () => void;
};

const AnimatedHamburgerButton = ({
  active,
  onClick,
}: AnimatedHamburgerButtonProps) => {
  return (
    <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
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
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-md">
      <div className="relative container mx-auto px-4 py-1 sm:py-1 md:py-1 flex items-center justify-between">
        <div className="hidden teste:flex items-center gap-10">
          
          <Link
            href="/"
            aria-label="Página Inicial"
          >
            <AnimatedLogo />
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sobre o Projeto
            </Link>
            <Link
              href="/cadastro-mei"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Cadastro MEIdeSaquá
            </Link>
            <Link
              href="/espaco-mei"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Espaço MEI
            </Link>
          </nav>
        </div>

        <div className="teste:hidden w-full">
          <Link href="/" aria-label="Página Inicial" className="flex justify-center">
             <AnimatedLogo />
          </Link>
        </div>

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

          {isLoading ? (
            <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/perfil"
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <UserIcon size={22} />
                <span className="font-medium">{user.username}</span>
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-500 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>

        <div className="teste:hidden absolute right-4 top-1/2 -translate-y-1/2">
          <AnimatedHamburgerButton
            active={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="teste:hidden absolute top-full left-0 w-full bg-white border-t border-blue-100 shadow-xl py-4 z-40 rounded-b-lg animate-slide-down">
          <nav className="flex flex-col space-y-4 px-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sobre o Projeto
            </Link>
            <Link
              href="/cadastro-mei"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Cadastro MEIdeSaquá
            </Link>
            <Link
              href="/espaco-mei"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Espaço MEI
            </Link>
            <hr className="border-gray-200" />

            {isLoading ? (
              <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {user.chosenAvatar ? (
                    <Image
                      src={`/avatars/${user.chosenAvatar}`}
                      alt="Avatar do usuário"
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                  Meu Perfil ({user.username})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors font-medium text-left"
                >
                  <LogOut size={20} /> Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={20} /> Efetuar Login
              </Link>
            )}

            <a
              href="https://www.instagram.com/prefeiturasaquarema/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <Instagram size={20} /> Instagram
            </a>
            <a
              href="https://www.saquarema.rj.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-700 transition-colors"
            >
              <Globe size={20} /> Site da Prefeitura
            </a>
            <a
              href="/contato"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-700 transition-colors"
            >
              <MessageCircleQuestion size={20} /> Fale Conosco
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}