// components/ConditionalFooter.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer"; // Importa seu footer original

export function ConditionalFooter() {
  const pathname = usePathname();

  // Lógica corrigida:
  // Verifica se o caminho atual COMEÇA COM "/admin"
  const shouldHide = pathname.startsWith("/admin");

  // Se for qualquer rota /admin, não renderiza nada
  if (shouldHide) {
    return null;
  }

  // Caso contrário, renderiza o Footer normalmente
  return <Footer />;
}
