"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  Contrast,
  ArrowUp,
  MousePointerClick,
  BookAudio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AccessibilityStyles from "./AccessibilityStyles";

// 1. IMPORTE OS COMPONENTES DO TOOLTIP
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AccessibilityFeatures = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const speak = (text: string) => {
    // ... (função inalterada)
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    window.speechSynthesis.speak(utterance);
  };

  const cancelSpeech = () => {
    // ... (função inalterada)
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    // ... (lógica do useEffect inalterada)
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const readableTags = [
        "P",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "A",
        "BUTTON",
        "LI",
        "SPAN",
        "LABEL",
        "TD",
      ];
      if (readableTags.includes(target.tagName) && target.textContent) {
        speak(target.textContent);
      }
    };

    if (isReadingMode) {
      document.body.addEventListener("mouseover", handleMouseOver);
      document.body.addEventListener("mouseout", cancelSpeech);
    } else {
      cancelSpeech();
    }

    return () => {
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", cancelSpeech);
    };
  }, [isReadingMode]);

  useEffect(() => {
    // ... (lógica do useEffect inalterada)
    const root = document.documentElement;
    const body = document.body;

    root.style.fontSize = `${fontSize}px`;

    if (highContrast) {
      root.setAttribute("data-theme", "inverted");
    } else {
      root.removeAttribute("data-theme");
    }

    if (highlightLinks) {
      body.setAttribute("data-links", "highlight");
    } else {
      body.removeAttribute("data-links");
    }
  }, [fontSize, highContrast, highlightLinks]);

  const increaseFontSize = () => setFontSize((size) => Math.min(size + 2, 24));
  const decreaseFontSize = () => setFontSize((size) => Math.max(size - 2, 12));
  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleHighlightLinks = () => setHighlightLinks((prev) => !prev);
  const toggleReadingMode = () => setIsReadingMode((prev) => !prev);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const buttonClasses =
    "bg-blue-600 hover:bg-gradient-to-br from-[#017DB9] to-[#22c362] text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110";

  const menuVariants = {
    // ... (variantes inalteradas)
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };

  const itemVariants = {
    // ... (variantes inalteradas)
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <AccessibilityStyles />
      <TooltipProvider delayDuration={100}>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center gap-3"
              >
                {/* Botão: Voltar ao topo */}
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={scrollToTop}
                        aria-label="Voltar ao topo"
                        className={buttonClasses}
                      >
                        <ArrowUp size={24} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voltar ao topo</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Botão: Leitor de texto */}
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleReadingMode}
                        aria-label="Ativar leitor de texto"
                        className={`${buttonClasses} ${
                          isReadingMode ? "bg-green-500" : ""
                        }`}
                      >
                        <BookAudio size={24} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isReadingMode
                          ? "Desativar leitor de texto"
                          : "Ativar leitor de texto"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Botão: Destacar links */}
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleHighlightLinks}
                        aria-label="Destacar links clicáveis"
                        className={buttonClasses}
                      >
                        <MousePointerClick size={24} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Destacar links</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Botão: Alto contraste */}
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleHighContrast}
                        aria-label="Alternar alto contraste"
                        className={buttonClasses}
                      >
                        <Contrast size={24} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Alto contraste</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Botão: Diminuir fonte */}
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={decreaseFontSize}
                        aria-label="Diminuir zoom"
                        className={buttonClasses}
                      >
                        <ZoomOut size={24} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Diminuir zoom</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Botão: Aumentar fonte */}
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={increaseFontSize}
                        aria-label="Aumentar zoom"
                        className={buttonClasses}
                      >
                        <ZoomIn size={24} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aumentar zoom</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão principal de Acessibilidade */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Abrir menu de acessibilidade"
                className={`${buttonClasses} ${
                  isMenuOpen ? "bg-green-500" : "bg-blue-600"
                }`}
              >
                <Accessibility size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isMenuOpen ? "Fechar menu" : "Abrir menu de acessibilidade"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </>
  );
};

export default AccessibilityFeatures;
