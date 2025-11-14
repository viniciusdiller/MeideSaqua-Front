"use client";

import { usePathname } from "next/navigation";
import FaleConoscoButton from "./FaleConoscoButton"; // Importa o botão que você já tem

const ConditionalFaleConosco = () => {
  const pathname = usePathname();

  // Lista de rotas onde o botão NÃO deve aparecer
  const hiddenRoutes = [
    "/cadastro-mei", // Rota exata da página de cadastro
    // Adicione outras rotas aqui se precisar, ex: "/admin"
  ];

  // Verifica se a rota atual começa com alguma das rotas escondidas
  const isHidden = hiddenRoutes.some((route) => pathname.startsWith(route));

  if (isHidden) {
    return null; // Não renderiza nada se estiver na página de cadastro
  }

  // Renderiza o botão em todas as outras páginas
  return <FaleConoscoButton />;
};

export default ConditionalFaleConosco;