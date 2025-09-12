import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer"; 

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
      <body
        className={`${poppins.variable} bg-white flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

