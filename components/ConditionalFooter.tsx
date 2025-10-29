// components/ConditionalFooter.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer"; // Importa seu footer original

// Lista de rotas onde o Footer NÃO deve aparecer
const HIDE_FOOTER_ON_PATHS = [
  "/admin/dashboard",
  "/admin/login",
  // Adicione aqui qualquer outra rota /admin que você não queira o footer
];

export function ConditionalFooter() {
  const pathname = usePathname();

  // Verifica se a rota atual está na lista de "esconder"
  const shouldHide = HIDE_FOOTER_ON_PATHS.includes(pathname);

  // Se for para esconder, não renderiza nada (retorna null)
  if (shouldHide) {
    return null;
  }

  // Caso contrário, renderiza o Footer normalmente
  return <Footer />;
}
