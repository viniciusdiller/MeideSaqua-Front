"use client";

import Image from 'next/image';
import { motion } from "framer-motion";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#017DB9] mb-6">Entre em Contato</h1>
        <p className="text-lg text-gray-700 mb-10">
          Gostaria de ter seu estabelecimento no site também?  
          Faça o cadastro clicando no card abaixo.
        </p>

        <a
          href="https://www.instagram.com/micaelrobertt/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cadastre seu estabelecimento"
        >
<motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto cursor-pointer border border-[#017DB9]/20 hover:border-[#017DB9] transition-all"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
      <div className="relative w-full h-64">
        <Image
          src="/gatinho.jpg"
          alt="Cadastro"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#017DB9] mb-2">
          Cadastre seu Estabelecimento
        </h2>
        <p className="text-gray-600 text-sm">
          Clique aqui e faça parte do ExploreSaquá, colocando seu negócio em destaque.
        </p>
      </div>
</motion.div>

        </a>
      </div>
    </div>
  );
}
