// components/ConditionalAccessibility.tsx
"use client";

import { usePathname } from "next/navigation";
import AccessibilityFeatures from "@/components/AccessibilityFeatures";

export function ConditionalAccessibility() {
  const pathname = usePathname();

  // Se o pathname começar com /admin, não renderize nada (null)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Caso contrário, renderize o botão
  return <AccessibilityFeatures />;
}
