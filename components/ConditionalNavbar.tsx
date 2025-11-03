// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/app/navbar"; // Verifique se o caminho para sua Navbar está correto

export function ConditionalNavbar() {
  const pathname = usePathname();

  // Se o pathname começar com /admin, não renderize nada (null)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Caso contrário, renderize a Navbar
  return <Navbar />;
}
