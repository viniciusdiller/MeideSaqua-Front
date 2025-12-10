"use client";

import { usePathname } from "next/navigation";
import FaleConoscoButton from "./FaleConoscoButton"; // Importa o botão que você já tem

const ConditionalFaleConosco = () => {
  const pathname = usePathname();

  // Lista de rotas onde o botão NÃO deve aparecer
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Renderiza o botão em todas as outras páginas
  return <FaleConoscoButton />;
};

export default ConditionalFaleConosco;
