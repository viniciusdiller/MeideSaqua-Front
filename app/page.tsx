// PAGE PRINCIPAL
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import Head from "next/head";
import ImageCarousel from "../components/ImageCarousel";
import { Navbar } from "./navbar";
import { Search } from "lucide-react";

export { categories };
const categories = [
  {
    id: "artesanato",
    title: "Artesanato e Criação Manual",
    backgroundimg: "/categorias/Artesanato.png",
  },
  {
    id: "beleza",
    title: "Beleza, Moda e Estética",
    backgroundimg: "/categorias/Moda.jpeg",
  },
  {
    id: "comercio",
    title: "Comércio Local e Vendas",
    backgroundimg: "/categorias/Comércio.jpg",
  },
  {
    id: "construcao",
    title: "Construção, Reforma e Manutenção",
    backgroundimg: "/categorias/Construção.jpg",
  },
  {
    id: "festas",
    title: "Festas e Eventos",
    backgroundimg: "/categorias/Festa.jpeg",
  },
  {
    id: "gastronomia",
    title: "Gastronomia e Alimentação",
    backgroundimg: "/categorias/Alimentação.jpeg",
  },
  {
    id: "saude",
    title: "Saúde, Bem-estar e Fitness",
    backgroundimg: "/categorias/Saúde.jpg",
  },
  {
    id: "servicos-administrativos",
    title: "Serviços Administrativos e Apoio",
    backgroundimg: "/categorias/Serviços.jpeg",
  },
  {
    id: "servicos-automotivos",
    title: "Serviços Automotivos e Reparos",
    backgroundimg: "/categorias/Serviços Automotivos.jpg",
  },
  {
    id: "tecnologia",
    title: "Tecnologia e Serviços Digitais",
    backgroundimg: "",
  },
  {
    id: "turismo",
    title: "Turismo, Cultura e Lazer",
    backgroundimg: "",
  },
];

export default function HomePage() {
  const [visibleCards, setVisibleCards] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const totalItems = categories.length + 1;
    const timer = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev < totalItems) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight;
      if (scrollPosition >= bottomPosition - 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. O filtro de categorias continua o mesmo, sem o "Espaço MEI".
  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ALTERAÇÃO PRINCIPAL ---
  // 2. Criamos uma variável para controlar a visibilidade do card "Espaço MEI".
  // Ele será visível se a busca estiver vazia OU se o termo de busca for encontrado em "Espaço MEI".
  const showEspacoMei =
    searchTerm.trim() === "" ||
    "espaço mei".toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 to-white pt-8">
        {/* Header e Hero Section (sem alterações) */}
        <Image
          src="/logo2sq.png"
          alt="Logo Prefeitura de Saquarema"
          width={2660}
          height={898}
          className="hidden md:hidden mx-auto h-20 w-auto mb-5"
        />
        <Link href="/" target="about:blank">
          <Image
            src="/LogoMeideSaqua.png"
            alt="Logo MeideSaqua"
            width={2660}
            height={898}
            className="md:block mx-auto h-10 sm:h-12 w-auto mb-5 milecem:h-16"
          />
        </Link>
        <ImageCarousel />
        <section className="container mx-auto px-4 py-8 md:py-8 relative z-10 -mt-[1px] md:-mt-[1px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Vitrine de{" "}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                MEIs
              </span>{" "}
              de Saquarema
            </h2>
            <p className="text-xl font-bold text-gray-700 md:text-gray-600 max-w-2xl mx-auto">
              A vitrine digital de quem faz a economia local acontecer. Conheça
              os{" "}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                MEIdeSaquá!
              </span>{" "}
            </p>
            <div className="max-w-md mx-auto mt-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar por categoria..."
                  className="
                w-full pl-12 pr-4 py-3
                rounded-2xl border border-gray-200 bg-white shadow-sm
                focus:outline-none focus:ring-2 focus:ring-purple-600/70 focus:border-transparent
                transition-all duration-300 placeholder-gray-400 text-sm
                hover:shadow-md
              "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {/* Mapeamento das categorias filtradas (como no original) */}
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  index < visibleCards
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Link href={`/categoria/${category.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ">
                    <div className="relative w-full rounded-md overflow-hidden h-40 flex justify-center items-center">
                      {category.backgroundimg && (
                        <Image
                          src={category.backgroundimg}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div
                        className={`absolute inset-0 bg-black backdrop-blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300 `}
                      />
                      <div className="relative p-6">
                        <h3 className=" font-poppins text-2xl font-bold text-white mb-auto group-hover: text-shadow-lg">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:via-orange-500 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* --- ALTERAÇÃO PRINCIPAL --- */}
            {/* 3. Renderização condicional do card "Espaço MEI" */}
            {showEspacoMei && (
              <motion.div
                key="espaco-mei"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  // A animação depende do número de categorias filtradas
                  filteredCategories.length < visibleCards
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{
                  duration: 0.5,
                  delay: filteredCategories.length * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Link href="/espaco-mei">
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                    <div className="relative w-full rounded-md overflow-hidden h-40 flex justify-center items-center">
                      <Image
                        src="/gatooculos.jpg"
                        alt="Espaço Mei"
                        fill
                        className="object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-black backdrop-blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
                      />
                      <div className="relative p-6">
                        <h3 className="font-poppins text-2xl font-bold text-white mb-auto group-hover:text-shadow-lg">
                          Espaço MEI
                        </h3>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:via-orange-500 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* O restante do código (botão e footer) permanece igual */}
        {showScrollTop && (
          <motion.button
            type="button"
            aria-label="Voltar ao topo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
            fixed bottom-6 left-6 z-50 
            bg-purple-600 hover:bg-orange-500
            text-white font-semibold font-sans 
            px-5 py-3 rounded-full 
            shadow-lg shadow-blue-600/50 
            flex items-center gap-2
            transition-colors duration-300
            md:hidden
            select-none
            cursor-pointer
          "
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                MEIdeSaquá
              </h3>
              <p className="text-gray-600 mb-4">
                {" "}
                A vitrine digital que valoriza o empreendedor local e fortalece
                a economia de Saquarema
              </p>
              <hr className="w-16 mx-auto border-gray-300 mb-4" />{" "}
              <p className="text-gray-500 text-sm">
                © Desenvolvido pela{" "}
                <span className="font-medium text-gray-600">
                  Secretaria Municipal de Governança e Sustentabilidade de
                  Saquarema
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}