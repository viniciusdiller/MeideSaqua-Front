"use client";

import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
// 1. Importe os componentes do Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FaleConoscoButton = () => {
  return (
    // 2. Adicione o TooltipProvider como o componente principal
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        {/* 3. O TooltipTrigger envolve o elemento que aciona o tooltip (seu botão) */}
        <TooltipTrigger asChild>
          <Link
            href="/contato"
            className="hidden sm:flex fixed bottom-8 left-8 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-gradient-to-br from-[#017DB9] to-[#22c362] transition-colors duration-300 items-center justify-center"
            aria-label="Fale Conosco"
          >
            <MessageCircleQuestion size={28} />
          </Link>
        </TooltipTrigger>
        {/* 4. TooltipContent é o que aparece quando o mouse está sobre o botão */}
        <TooltipContent>
          <p>Fale Conosco</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FaleConoscoButton;
