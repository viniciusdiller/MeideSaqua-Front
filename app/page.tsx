"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import Head from "next/head";
import ImageCarousel from "../components/ImageCarousel";
import { Navbar } from "./navbar";
import {
  UtensilsCrossed,
  MapPin,
  Mountain,
  Dumbbell,
  GraduationCap,
  ShoppingCart,
  Bus,
  Hotel,
  Calendar,
  Building,
  Waves,
  Heart,
  BriefcaseBusiness,
  Ambulance,
  Volleyball,
  Cherry,
  Search,
  PhoneCall,
} from "lucide-react";
export { categories };
const categories = [
  {
    id: "restaurantes",
    title: "Restaurantes e Lanchonetes",
    icon: UtensilsCrossed,
    color: "from-orange-400 to-red-500",
    description: "Sabores únicos da região",
  },
  {
    id: "pontos-turisticos",
    title: "Pontos Turísticos",
    icon: MapPin,
    color: "from-blue-400 to-purple-500",
    description: "Lugares imperdíveis",
  },
  {
    id: "trilhas",
    title: "Trilhas",
    icon: Mountain,
    color: "from-green-400 to-emerald-500",
    description: "Aventuras na natureza",
  },
  {
    id: "telefones-uteis",
    title: "Telefones Úteis",
    icon: PhoneCall,
    color: "from-red-400 to-pink-500",
    description: "Mantenha-se conectado",
  },
  {
    id: "escolas",
    title: "Escolas",
    icon: GraduationCap,
    color: "from-indigo-400 to-blue-500",
    description: "Educação de qualidade",
  },
  {
    id: "supermercados",
    title: "Supermercados",
    icon: ShoppingCart,
    color: "from-yellow-400 to-orange-500",
    description: "Tudo que você precisa",
  },
  {
    id: "transporte",
    title: "Transporte Público",
    icon: Bus,
    color: "from-cyan-400 to-blue-500",
    description: "Mobilidade urbana",
  },
  {
    id: "hospedagens",
    title: "Hospedagens",
    icon: Hotel,
    color: "from-purple-400 to-pink-500",
    description: "Conforto e acolhimento",
  },
  {
    id: "eventos",
    title: "Eventos Locais",
    icon: Calendar,
    color: "from-rose-400 to-red-500",
    description: "Cultura e entretenimento",
  },
  {
    id: "lazer-e-esporte",
    title: "Lazer e Esporte",
    icon: Volleyball,
    color: "from-amber-400 to-yellow-500",
    description: "Diversão e atividades físicas",
  },
  {
    id: "espacos-culturais",
    title: "Espaços Culturais",
    icon: Building,
    color: "from-violet-400 to-purple-500",
    description: "Arte e história local",
  },
  {
    id: "praias",
    title: "Praias e Lagoas",
    icon: Waves,
    color: "from-teal-400 to-cyan-500",
    description: "Paraíso natural",
  },
  {
    id: "mulheres-e-criancas",
    title: "Mulheres e Crianças",
    icon: Heart,
    color: "from-pink-400 to-red-600",
    description: "Apoio e serviços essenciais",
  },
  {
    id: "compras",
    title: "Compras",
    icon: BriefcaseBusiness,
    color: "from-gray-400 to-gray-500",
    description: "Melhores lojas e serviços",
  },
  {
    id: "emergencias",
    title: "Emergências",
    icon: Ambulance,
    color: "from-red-600 to-rose-700",
    description: "Serviços de emergência e saúde",
  },
  {
    id: "feiras",
    title: "Feiras e Produtores Rurais",
    icon: Cherry,
    color: "from-green-400 to-lime-300",
    description: "Serviços de saúde e bem-estar",
  },
];

export default function HomePage() {
  const [visibleCards, setVisibleCards] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Animação progressiva dos cards
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev < categories.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Verificar se chegou ao fim da página
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

  return (
    <>
      <Head>
        <title>ExploreSaquá - Descubra Saquarema</title>
        <meta
          name="description"
          content="Seu guia completo para explorar os melhores lugares, serviços e atrações de Saquarema."
        />
        <meta property="og:image" content="/logo2sq.png" />
        <meta property="og:title" content="ExploreSaquá" />
        <meta
          property="og:description"
          content="Descubra os encantos de Saquarema de forma gratuita."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://explora-saqua.vercel.app/" />
      </Head>

      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 to-white pt-8">
        {/* Header */}

        {/* imagem como banner com efeito fade na parte inferior */}
        <Image
          src="/logo2sq.png"
          alt="Logo Prefeitura de Saquarema"
          width={2660}
          height={898}
          className=" hidden md:hidden block mx-auto h-20 w-auto mb-5"
        />
        <Image
          src="/LogoExplora.png"
          alt="Logo ExploraSaquá"
          width={2660}
          height={898}
          className="md:block mx-auto h-10 sm:h-12 w-auto mb-5 milecem:h-16"
        />
        <ImageCarousel />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-8 relative z-10 -mt-[1px] md:-mt-[1px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              O que você quer{" "}
              <span className="bg-gradient-to-r from-[#017DB9] to-[#007a73] bg-clip-text text-transparent">
                explorar
              </span>{" "}
              hoje?
            </h2>
            <p className="text-xl font-bold text-gray-700 md:text-gray-600 max-w-2xl mx-auto">
              Descubra os melhores lugares de Saquarema com nosso guia completo
              para moradores e visitantes
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
                focus:outline-none focus:ring-2 focus:ring-[#017DB9] focus:border-transparent
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
            {categories
              .filter(
                (category) =>
                  category.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  category.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((category, index) => {
                const Icon = category.icon;
                return (
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
                      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        />

                        <div className="p-6">
                          <div
                            className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-125 group-hover:brightness-110 transition-transform duration-300`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
                            {category.title}
                          </h3>

                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-blue-400 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </section>
        {/* Botão "Voltar ao topo" */}
        {showScrollTop && (
          <motion.button
            type="button"
            aria-label="Voltar ao topo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
            fixed bottom-6 left-6 z-50 
            bg-[#017DB9] hover:bg-blue-800 
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

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ExploreSaquá
              </h3>
              <p className="text-gray-600 mb-4">
                {" "}
                {/* mb-4 aqui para espaçar o parágrafo de descrição */}
                Seu guia completo para descobrir o melhor de Saquarema
              </p>
              {/* Linha horizontal sutil */}
              <hr className="w-16 mx-auto border-gray-300 mb-4" />{" "}
              {/*  uma linha divisória curta e centralizada */}
              <p className="text-gray-500 text-sm">
                © Desenvolvido por{" "}
                <span className="font-medium text-gray-600">Micael Robert</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
