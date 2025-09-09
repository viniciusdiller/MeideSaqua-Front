// EPAÇO MEI
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <section className="mb-8">
          <div className="md:flex md:items-start md:gap-8 lg:gap-12">
            <div className="md:w-2/3">
              <h1
                className=" text-4xl font-extrabold mb-6 inline-block pb-2
                    bg-gradient-to-r from-[#017DB9] to-[#22c362]
                    bg-no-repeat
                    [background-position:0_100%]
                    [background-size:100%_4px]"
              >
                <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
                  ESPAÇO MEI
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                Aqui você encontra informações, oportunidades e ferramentas para
                impulsionar o seu negócio.
              </p>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0">
              <Image
                src="/Sala-do-Empreendedor.jpg"
                alt="Logo Espaço do Empreendedor"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE CONTEÚDO PRINCIPAL --- */}
        <section className="mt-8 border-t pt-6">
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Nesse espaço serão divulgadas capacitações, cursos, oficinas e
            treinamentos, além de oportunidades para participação em licitações
            públicas, feiras, eventos e projetos especiais.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O Espaço MEI é uma iniciativa em parceria com a Sala do Empreendedor
            de Saquarema, que atua como grande aliada na formalização, no apoio,
            reconhecimento e valorização dos microempreendedores da cidade. Essa
            união garante o acesso a programas de qualificação, orientação e
            iniciativas que fortalecem os MEI's, criando condições para que cada
            negócio possa crescer, se profissionalizar e conquistar novos
            mercados.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Mais do que um canal de informação, o Espaço MEI é um ambiente de
            valorização e fortalecimento do microempreendedorismo, reafirmando o
            compromisso da Prefeitura Municipal de Saquarema em apoiar quem gera
            renda, movimenta a economia e preserva a identidade da nossa cidade.
          </p>
        </section>

        {/* --- CURSOS --- */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Cursos e Capacitações disponíveis:
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Exemplo de Item Clicável */}
            <Link
              href="https://sebrae.com.br/sites/PortalSebrae/cursosonline/como-agir-de-maneira-empreendedora,2ac0b8a6a28bb610VgnVCM1000004c00210aRCRD"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Como agir de maneira empreendedora.png"
                  alt="Logo do Sebrae"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Como agir de maneira empreendedora
              </p>
            </Link>

            <Link
              href="https://sebrae.com.br/sites/PortalSebrae/cursosonline/empreender-na-pratica,2e7a4dadbe612810VgnVCM100000d701210aRCRD"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Empreender na prática.png"
                  alt="Logo da AgeRio"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Empreender na prática
              </p>
            </Link>

            <Link
              href="https://sebrae.com.br/sites/PortalSebrae/cursosonline/como-formalizar-seu-negocio-como-mei,3180b8a6a28bb610VgnVCM1000004c00210aRCRD"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Como formalizar seu negócio como microempreendedor individual.png"
                  alt="Logo da JUCERJA"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Como formalizar seu negócio como microempreendedor individual
              </p>
            </Link>

            <Link
              href="https://sebrae.com.br/sites/PortalSebrae/cursosonline/empreendedorismo-como-opcao-de-carreira,7e70b8a6a28bb610VgnVCM1000004c00210aRCRD"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Empreendedorismo como opção de carreira.png"
                  alt="Logo do Portal do Empreendedor"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Empreendedorismo como opção de carreira
              </p>
            </Link>

            <Link
              href="https://capacitabr.portaldoempreendedor.gov.br/cursos/1/372000001028"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Imagem-gov.jpg"
                  alt="Logo da Prefeitura de Saquarema"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Aprender a empreender
              </p>
            </Link>

            <Link
              href="https://capacitabr.portaldoempreendedor.gov.br/cursos/5/C02"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Imagem-gov.jpg"
                  alt="Logo do Simples Nacional"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Como ser um(a) empreendedor(a) mais eficiente
              </p>
            </Link>

            <Link
              href="https://capacitabr.portaldoempreendedor.gov.br/cursos/5/C11"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Imagem-gov.jpg"
                  alt="Logo do Simples Nacional"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Curso pelo whatsApp: Meu Negócio Online
              </p>
            </Link>

            <Link
              href="https://capacitabr.portaldoempreendedor.gov.br/cursos/1/372000005124"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/Imagem-gov.jpg"
                  alt="Logo do Simples Nacional"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Fluxo de caixa como ferramenta de gestão para o seu negócio
              </p>
            </Link>
          </div>
        </section>

        {/* --- SEÇÃO DE PERGUNTAS FREQUENTES --- */}
        <section className="mt-12 border-t pt-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
                <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
                  Desejo me formalizar como MEI, atualizar meu cadastro ou obter
                  mais informações sobre MEI’s, como faço?
                </span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Você pode acessar o portal nacional de MEI’s no endereço
                eletrônico{" "}
                <a
                  href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.gov.br/empresas-e-negocios/pt-br/empreendedor
                </a>{" "}
                ou buscar atendimento por meio da nossa Sala do Empreendedor de
                Saquarema, nos canais de atendimento a seguir:
              </p>
              <ul className="list-none text-gray-700 leading-relaxed text-lg space-y-2 mt-6 pt-4 border-t">
                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/5522920052534"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline hover:text-blue-600"
                  >
                    22 92005-2534
                  </a>
                </li>
                <li>
                  <strong>E-mail:</strong>{" "}
                  <a
                    href="mailto:saladoempreendedor@saquarema.rj.gov.br"
                    className="text-gray-700 hover:underline hover:text-blue-600"
                  >
                    <span className="sm:hidden">
                      saladoempreendedor
                      <br />
                      @saquarema.rj.gov.br
                    </span>
                    <span className="hidden sm:inline">
                      saladoempreendedor@saquarema.rj.gov.br
                    </span>
                  </a>
                </li>
                <li className="pt-2">
                  <strong>Endereço 1:</strong>{" "}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=R.+Barão+de+Saquarema,+n°+243+-+Sala+5+-+Centro,+Saquarema+-+RJ,+28990-772"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline hover:text-blue-600"
                  >
                    R. Barão de Saquarema, n° 243 - Sala 5 - Centro, Saquarema -
                    RJ, 28990-772
                  </a>
                </li>
                <li>
                  <strong>Endereço 2:</strong>{" "}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+Saquarema,+5483+-+Porto+da+Roça,+Saquarema+-+RJ,+28994-711"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline hover:text-blue-600"
                  >
                    Av. Saquarema, 5483 - Porto da Roça, Saquarema - RJ,
                    28994-711 (2° andar)
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
