import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // 1. Importado Poppins ao invés de Inter
import "./globals.css";
import { Navbar } from "./navbar";

// 2. Configurado a fonte Poppins com os pesos e a variável CSS
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MeideSaquá - Descubra os MEIs Saquarema",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MeideSaquá",
    description:
      "Seu guia completo para explorar e conhecer os MEIs que movimentam a economia de Saquarema.",
    url: "https://explora-saqua.vercel.app/",
    siteName: "ExploreSaquá",
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
      {/* 3. Aplicado a variável da fonte no body */}
      <body className={`${poppins.variable} bg-white`}>
        <Navbar /> {/* visible on all pages */}
        <main>{children}</main>
      </body>
    </html>
  );
}
