"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

const iframeSrc =
  "https://workflow-iframe.colab.re/68b6f012c7e692235981871f/?connectionString=O%2FnozPB6LxDGo8FM4TxahSTY4ru3dM2CURweOqjPKFuXUwIUI%2B24Z3T%2BOE77vpZfMnPrl9mZlAobBjf3UFaUD0xGYdLPZTjokuVdFxk%2BcY6WBXqKJLe3oWOhQ3tcD9cm2Fr6Lk6rJxdv2S1vurzj7BRGdeMy6h8%2B8se7XMNRPiaCkuJ6w7FHm1ngUOuG1I4J%2FO00U00ONaKluiyTGu%2BK%2F9zwPVS%2BNaHQPjHbDhN55Iwao6c%2Fm5gHe5A3i5tqMjm%2B8qKWfjJMs9rilAmL8lyWFUAgILz9HXsnI9J97Sxy%2FjHH7U0zE6PLJF1iJz8DAepf2HuFulwGDXM52ZX9lW7Ctg%3D%3D";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Entre em Contato
        </h1>

        <p className="text-gray-600 mb-8">
          Utilize o formulário abaixo para enviar sua mensagem, sugestão ou
          parceria.
        </p>

        {/* Contêiner para o Iframe */}
        <div className="w-full h-[650px] bg-white rounded-xl shadow-md overflow-hidden border-2 border-purple-500 border-opacity-50">
          <iframe
            src={iframeSrc}
            width="100%"
            height="100%"
            allowFullScreen
          ></iframe>
        </div>
      </main>
    </div>
  );
}
