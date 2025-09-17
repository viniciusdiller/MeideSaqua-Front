"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import ImageCarousel from "../components/ImageCarousel";
import { Search } from "lucide-react";
import ButtonWrapper from "../components/ui/button-home";
import FaleConoscoButton from "@/components/FaleConoscoButton";

export { categories };
const categories = [
  {
    id: "artesanato",
    title: "Artesanato e Criação Manual",
    icon: "/icons/artesanato.svg",
    backgroundimg: "/categorias/Artesanato.png",
    tagsinv:
      "artesanato, manualidades, trabalhos manuais, feito à mão, feito a mão, handmade, DIY, do it yourself, bordado, bordados, crochê, croche, tricô, trico, macramê, macrame, fuxico, patchwork, quilt, quiltar, costura criativa, costura, tecido, tecidos, bijuteria, bijouteria, colares, pulseiras, brincos, acessórios, biscuit, cerâmica, ceramica, barro, escultura, modelagem, artes plásticas, artes plasticas, pintura em tecido, pintura em tela, pintura decorativa, velas artesanais, velas decorativas, saboaria artesanal, sabão artesanal, reciclagem criativa, reaproveitamento, decoração artesanal, lembrancinhas, lembranças, souvenirs, trabalhos de barbante, barbante",
  },
  {
    id: "beleza",
    title: "Beleza, Moda e Estética",
    icon: "/icons/beleza.svg",
    backgroundimg: "/categorias/Moda.jpeg",
    tagsinv:
      "beleza, estética, estetica, estética facial, estética corporal, salão de beleza, cabeleireiro, cabelereiro, corte de cabelo, escova, maquiagem, make, maquiagem profissional, design de sobrancelha, sobrancelhas, depilação, depilacao, depilação a laser, manicure, pedicure, unha, unhas, alongamento de unhas, esmalteria, cuidados com a pele, skincare, cuidados pessoais, cuidados estéticos, tratamento capilar, hidratação, moda, roupas, vestuário, fashion, tendências, tendência, consultoria de imagem, consultoria de estilo, personal stylist, desfile, estética avançada, harmonização facial, limpeza de pele, rejuvenescimento",
  },
  {
    id: "comercio",
    title: "Comércio Local e Vendas",
    icon: "/icons/comercio.svg",
    backgroundimg: "/categorias/Comércio.jpg",
    tagsinv:
      "comércio, comercio, vendas, lojista, loja, varejo, atacado, comércio local, mercado, feirante, mercadinho, mercearia, quitanda, supermercado, padaria, açougue, bazar, armarinho, livraria, papelaria, brechó, outlet, shopping, e-commerce, ecommerce, loja online, marketplace, delivery, revenda, revendedor, autônomo, autônoma, microempreendedor, MEI",
  },
  {
    id: "construcao",
    title: "Construção, Reforma e Manutenção",
    icon: "/icons/construcao.svg",
    backgroundimg: "/categorias/Construção.jpg",
    tagsinv:
      "construção, reforma, manutenção, pedreiro, eletricista, encanador, pintor, gesseiro, carpinteiro, serralheiro, mestre de obras, engenheiro civil, arquiteto, construção civil, obra, obras, reparos, conserto, construção de casas, construção de prédios, fundação, alvenaria, reboco, telhado, telha, instalação elétrica, instalação hidráulica, jardinagem, paisagismo, hidráulica, hidráulico, elétrica, elétrica residencial, elétrica predial, manutenção predial, reforma de interiores, acabamento, pisos, porcelanato, azulejo, drywall, gesso, marcenaria",
  },
  {
    id: "festas",
    title: "Festas e Eventos",
    icon: "/icons/festas.svg",
    backgroundimg: "/categorias/Festa.jpeg",
    tagsinv:
      "festas, eventos, aniversário, aniversários, casamento, casamentos, debutante, 15 anos, bodas, confraternização, festa infantil, festa de empresa, formatura, buffet, cerimonial, cerimonialista, mestre de cerimônias, decoração de festa, balões, baloes, balonismo, lembrancinhas, lembranças, som, DJ, música ao vivo, banda, iluminação, fotografia, filmagem, aluguel de salão, aluguel de espaço, recepção, bartender, barman, garçom, garçons, segurança para festa, estrutura de eventos, palco, telão, festa temática",
  },
  {
    id: "gastronomia",
    title: "Gastronomia e Alimentação",
    icon: "/icons/gastronomia.svg",
    backgroundimg: "/categorias/Alimentação.jpeg",
    tagsinv:
      "gastronomia, culinária, cozinha, alimentação, comida, restaurante, lanchonete, bar, hamburgueria, pizzaria, sorveteria, confeitaria, padaria, cafeteria, churrascaria, quiosque, marmita, marmitex, self-service, buffet, delivery, comida saudável, alimentação saudável, fit, fitness, marmita fitness, comida caseira, comida japonesa, sushi, sashimi, comida chinesa, yakissoba, comida italiana, massas, lasanha, espaguete, comida brasileira, feijoada, moqueca, acarajé, pastel, quentinha, bebida, sucos, refrigerante, cerveja artesanal, drinks",
  },
  {
    id: "saude",
    title: "Saúde, Bem-estar e Fitness",
    icon: "/icons/saude.svg",
    backgroundimg: "/categorias/Saúde.jpg",
    tagsinv:
      "saúde, saude, bem-estar, bem estar, fitness, academia, musculação, crossfit, funcional, personal trainer, pilates, yoga, fisioterapia, psicologia, psicólogo, psiquiatra, terapia, terapeuta, nutricionista, nutrição, médico, medica, medicina, clínica, hospital, posto de saúde, posto medico, enfermagem, enfermeiro, enfermeira, cuidados médicos, saúde da família, estética, spa, relaxamento, massagem, massagista, acupuntura, quiropraxia, reiki, meditação, vida saudável, qualidade de vida, emagrecimento",
  },
  {
    id: "servicos-administrativos",
    title: "Serviços Administrativos e Apoio",
    icon: "/icons/administrativo.svg",
    backgroundimg: "/categorias/Serviços.jpeg",
    tagsinv:
      "serviços administrativos, apoio administrativo, escritório, assistente, secretária, secretaria, auxiliar administrativo, atendente, recepcionista, administrativo, contabilidade, contador, consultoria, gestão, financeiro, recursos humanos, RH, DP, folha de pagamento, emissão de nota fiscal, nota fiscal, processos administrativos, digitação, digitalização, arquivista, organização, suporte administrativo",
  },
  {
    id: "servicos-automotivos",
    title: "Serviços Automotivos e Reparos",
    icon: "/icons/automotivo.svg",
    backgroundimg: "/categorias/Serviços Automotivos.jpg",
    tagsinv:
      "automotivo, carro, moto, caminhão, oficina, oficina mecânica, mecânico, eletricista automotivo, autopeças, auto peças, acessórios automotivos, funilaria, pintura automotiva, alinhamento, balanceamento, troca de óleo, revisão, manutenção de carro, manutenção de moto, reparo de motor, borracharia, pneus, som automotivo, vidro automotivo, ar-condicionado automotivo, chaveiro automotivo, auto center, guincho",
  },
  {
    id: "tecnologia",
    title: "Tecnologia e Serviços Digitais",
    icon: "/icons/tecnologia.svg",
    backgroundimg: "/categorias/Tecnologia.jpg",
    tagsinv:
      "tecnologia, digital, serviços digitais, informática, informática, computador, computadores, TI, tecnologia da informação, hardware, software, sistemas, aplicativos, apps, app, desenvolvimento web, sites, programação, programador, desenvolvedor, suporte técnico, manutenção de computador, manutenção de notebook, conserto de celular, celular, smartphones, internet, redes, segurança digital, design gráfico, designer gráfico, edição de vídeo, social media, marketing digital, tráfego pago, SEO, hospedagem de site, cloud, nuvem, banco de dados, inteligência artificial, IA, pc, notebook, tablet",
  },
  {
    id: "turismo",
    title: "Turismo, Cultura e Lazer",
    icon: "/icons/turismo.svg",
    backgroundimg: "/categorias/Turismo.jpg",
    tagsinv:
      "turismo, viagem, viagens, passeios, cultura, lazer, entretenimento, guia turístico, guia de turismo, excursão, excursões, hotel, pousada, hospedagem, resort, hostel, camping, trilha, ecoturismo, turismo rural, turismo de aventura, turismo gastronômico, city tour, museu, teatro, cinema, shows, parques, parque aquático, zoológico, zoologico, praia, montanha, turismo religioso, turismo histórico, turismo cultural",
  },
  {
    id: "rural",
    title: "Produtores Rurais e Atividades Agrícolas",
    icon: "/icons/rural.svg",
    backgroundimg: "/categorias/Produtoes Rurais.jpg",
    tagsinv:
      "rural, campo, fazenda, agricultura, agronegócio, agro, produtor rural, pecuária, gado, criação de animais, avicultura, piscicultura, horticultura, fruticultura, plantação, colheita, lavoura, insumos agrícolas, sementes, adubo, trator, maquinário agrícola, agropecuária, silvicultura, agroindústria, apicultura, leite, laticínios, agrofloresta, orgânicos, orgânico, produtos naturais",
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

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tagsinv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showEspacoMei =
    searchTerm.trim() === "" ||
    "espaço mei".toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <>
      <div className="flex flex-col flex-grow bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 to-white pt-8">
        <Image
          src="/logo2sq.png"
          alt="Logo Prefeitura de Saquarema"
          width={2660}
          height={898}
          className="hidden md:hidden mx-auto h-20 w-auto mb-5"
        />
        <div>
          <Link href="/" target="about:blank">
            <Image
              src="/LogoMeideSaqua.png"
              alt="Logo MeideSaqua"
              width={2660}
              height={898}
              className="md:block mx-auto h-14 sm:h-20 w-auto mb-5 milecem:h-24"
            />
          </Link>
        </div>
        <ImageCarousel />

        <section className="flex-grow container mx-auto px-4 py-8 md:py-8 relative z-10 -mt-[1px] md:-mt-[1px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Vitrine de{" "}
              <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">
                MEIs
              </span>{" "}
              de Saquarema
            </h2>
            <p className="text-xl font-bold text-gray-700 md:text-gray-600 max-w-2xl mx-auto">
              A vitrine digital de quem faz a economia local acontecer. Conheça
              os{" "}
              <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
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
                focus:outline-none focus:ring-2 focus:ring-blue-600/70 focus:border-transparent
                transition-all duration-300 placeholder-gray-400 text-sm
                hover:shadow-md
              "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
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
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:via-green-500 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {showScrollTop && (
          <motion.button
            type="button"
            aria-label="Voltar ao topo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
            fixed bottom-6 left-6 z-50 
            bg-blue-600 hover:bg-green-500
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

        <div className="mt-auto pt-10 pb-24">
          <div className="text-center text-gray-600 mb-3">
            <h3>Gostaria que seu MEI aparecesse na vitrine?</h3>
          </div>
          <ButtonWrapper />
          <FaleConoscoButton />
        </div>
      </div>
    </>
  );
}
