import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import {ConditionalFooter} from "@/components/ConditionalFooter";
import { ConditionalAccessibility } from "@/components/ConditionalAccessibility";
import AccessibilityStyles from "@/components/AccessibilityStyles";
import ConditionalFaleConosco from "@/components/ConditionalFaleConosco";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MeideSaquá - Descubra os MEIs Saquarema",
  icons: {
    icon: "/FAVICON_MEIDESAQUA.png",
  },
  openGraph: {
    title: "MeideSaquá",
    description:
      "Seu guia completo para explorar e conhecer os MEIs que movimentam a economia de Saquarema.",
    url: "https://aquitemods.saquarema.rj.gov.br/",
    siteName: "MeideSaquá",
    images: [
      {
        url: "/logo2sq.png",
        width: 1200,
        height: 630,
        alt: "MeideSaquá Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <AccessibilityStyles /> {/* 2. ADICIONE O COMPONENTE DE ESTILOS AQUI */}
      </head>
      <body
        className={`${poppins.variable} bg-white flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <ConditionalNavbar />
          <main className="flex-grow">{children}</main>
          <ConditionalFooter />
          <Toaster richColors />
          <ConditionalAccessibility />
          <ConditionalFaleConosco />  
        </AuthProvider>
      </body>
    </html>
  );
}
