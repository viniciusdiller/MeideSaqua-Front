"use client";

import { useState, useEffect } from "react";
import { Contrast, Link as LinkIcon, ZoomIn, ZoomOut, BookAudio, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AccessibilityFeatures = () => {
  const [fontSize, setFontSize] = useState(1);
  const [isInverted, setIsInverted] = useState(false); // Nome mais claro
  const [isHighlightingLinks, setIsHighlightingLinks] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // Efeito para o tamanho da fonte
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}rem`;
  }, [fontSize]);

  // Efeito para a INVERSÃO DE CORES
  useEffect(() => {
    // Aplica o atributo no <html> para máxima prioridade!
    document.documentElement.setAttribute('data-theme', isInverted ? 'inverted' : 'default');
  }, [isInverted]);

  // Efeito para o Destaque de Links (aplicado no body)
  useEffect(() => {
     document.body.setAttribute('data-links', isHighlightingLinks ? 'highlight' : 'default');
  }, [isHighlightingLinks]);

  // Limpa a fala ao sair da página
  useEffect(() => {
    return () => { speechSynthesis.cancel(); };
  }, []);

  const increaseFontSize = () => setFontSize((s) => Math.min(s + 0.1, 1.5));
  const decreaseFontSize = () => setFontSize((s) => Math.max(s - 0.1, 0.8));
  const toggleInvertColors = () => setIsInverted((prev) => !prev); // Função com nome claro
  const toggleHighlightLinks = () => setIsHighlightingLinks((prev) => !prev);

  const handleToggleReading = () => {
    // ... (lógica do leitor de tela continua a mesma)
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const navContent = document.querySelector("nav")?.innerText || "";
    const mainContent = document.querySelector("main")?.innerText || "";
    const contentToRead = `Navegação: ${navContent}. Conteúdo principal: ${mainContent}`;

    if (contentToRead.trim().length > 0) {
      const utterance = new SpeechSynthesisUtterance(contentToRead);
      utterance.lang = "pt-BR";
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      speechSynthesis.speak(utterance);
    }
  };

  const accessibilityButtons = [
    { label: "Aumentar Fonte", icon: <ZoomIn size={20} />, onClick: increaseFontSize },
    { label: "Diminuir Fonte", icon: <ZoomOut size={20} />, onClick: decreaseFontSize },
    { label: "Inverter Cores", icon: <Contrast size={20} />, onClick: toggleInvertColors },
    { label: "Destacar Clicáveis", icon: <LinkIcon size={20} />, onClick: toggleHighlightLinks },
    { label: isReading ? "Parar Leitura" : "Leitor de Tela", icon: isReading ? <X size={20} /> : <BookAudio size={20} />, onClick: handleToggleReading },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {accessibilityButtons.map((btn) => (
          <Tooltip key={btn.label}>
            <TooltipTrigger asChild>
              <button
                onClick={btn.onClick}
                className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label={btn.label}
              >
                {btn.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left"><p>{btn.label}</p></TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default AccessibilityFeatures;