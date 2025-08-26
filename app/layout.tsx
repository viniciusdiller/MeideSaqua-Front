import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExploreSaquá - Descubra Saquarema",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ExploreSaquá",
    description:
      "Descubra os melhores lugares de Saquarema com nosso guia completo para moradores e visitantes",
    url: "https://explora-saqua.vercel.app/", /* change link according to domain */
    siteName: "ExploreSaquá",
    images: [
      {
        url: "/logo2sq.png",
        width: 1200,
        height: 630,
        alt: "ExploreSaquá Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white">
        <Navbar /> {/* visible on all pages */}
        <main>{children}</main>
      </body>
    </html>
  );
}
