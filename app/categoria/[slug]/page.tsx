"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone, Globe, Search } from "lucide-react";
import Image from "next/image";
import { categories } from "../../page";
import ModernCarousel from "@/components/ModernCarousel";
import { getAllEstablishments } from "@/lib/api";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const categoryInfo = categories.find((cat) => cat.id === params.slug);
        const categoryTitle = categoryInfo ? categoryInfo.title : "";
        if (!categoryTitle) {
          setLocations([]);
          return;
        }
        const allEstablishments = await getAllEstablishments();
        const filteredData = allEstablishments.filter(
          (loc: any) => loc.categoria === categoryTitle
        );
        setLocations(filteredData);
      } catch (error) {
        console.error("Erro ao buscar estabelecimentos da API:", error);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [params.slug]);

  const category = categories.find((cat) => cat.id === params.slug);

  const filteredLocations = locations.filter(
    (location) =>
      location.nomeFantasia &&
      typeof location.nomeFantasia === "string" &&
      location.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Categoria não encontrada
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar locais...</p>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Nenhum local encontrado para esta categoria.
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative h-48 md:h-32 w-full flex items-center justify-center text-white overflow-hidden shadow-lg">
        <Image
          src={category.backgroundimg || "/placeholder.jpg"}
          alt={`Background for ${category.title}`}
          fill
          className="object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>

        <div className="container mx-auto  px-4 relative z-20 text-center">
          <Link
            href="/"
            className="absolute -top-6 left-4 md:top-6 md:left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm"
          >
            <ArrowLeft className="w-2 h-2 md:w-6 md:h-6" />
            <span>Voltar</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold capitalize"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
          >
            {category.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/90 mt-2 text-sm md:text-base max-w-2xl mx-auto"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
          >
            Explore os melhores MEIs de Saquarema em{" "}
            {category.title.toLowerCase()}.
          </motion.p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 milecem:px-24">
        <div className="grid grid-cols-1 milecem:grid-cols-5 gap-8">
          <div className="flex flex-col milecem:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold text-gray-800 tracking-tight"
              >
                Locais Recomendados
              </motion.h2>
            </div>
            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/80 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-sm hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto px-2 space-y-4 pb-1 milecem:grid milecem:grid-cols-2 milecem:gap-4 milecem:space-y-0">
              {filteredLocations.map((location: any, index: number) => (
                <Link
                  href={`${location.estabelecimentoId}/MEI/`}
                  key={location.estabelecimentoId}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full ${
                      selectedLocation?.id === location.estabelecimentoId
                        ? "ring-2 ring-offset-2 ring-[#017DB9] shadow-lg"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 break-words pr-2">
                        {location.nomeFantasia}
                      </h3>
                      {location.rating && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600">
                            {location.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 text-sm break-words">
                      {location.descricaoDiferencial}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500 mt-auto">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span className="break-words">{location.endereco}</span>
                      </div>
                      {location.horarioFuncionamento && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                          <span className="break-words">
                            {location.horarioFuncionamento}
                          </span>
                        </div>
                      )}
                      {location.contatoEstabelecimento && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                          <span className="break-words">
                            {location.contatoEstabelecimento}
                          </span>
                        </div>
                      )}
                      {location.website && (
                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 mt-1 flex-shrink-0" />
                          <a
                            href={location.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visitar site
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          <div
            className="lg:sticky lg:top-0 milecem:pl-6 h-fit"
            id="map-container"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-4"
            >
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> Conheça também
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                clique no botão para explorar outra categoria
              </p>
            </motion.div>
            <div className="w-full h-[300px] md:h-[500px] rounded-2xl shadow-lg overflow-hidden border border-blue-600">
              <ModernCarousel currentCategoryId={category.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
