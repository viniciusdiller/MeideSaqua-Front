import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import FaleConoscoButton from "@/components/FaleConoscoButton";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        {/* --- CABEÇALHO --- */}
        <section className="mb-8">
          <div className="md:flex md:items-center md:gap-8 lg:gap-12">
            <div className="md:w-2/3">
              <h1
                className=" text-4xl font-extrabold mb-6 inline-block pb-2
                  bg-gradient-to-r from-[#017DB9] to-[#22c362]
                  bg-no-repeat
                  [background-position:0_100%]
                  [background-size:100%_4px]"
              >
                <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
                  Perguntas Frequentes (FAQ)
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                Tire suas dúvidas sobre o funcionamento da plataforma, o
                cadastro de MEI's e como avaliar os estabelecimentos.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Sua pergunta não está listada? Sinta-se à vontade para falar
                conosco! Estamos disponíveis no link 'Contato' no rodapé, no
                botão flutuante (canto inferior esquerdo) ou no menu superior
                (pelo celular).
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0 flex items-center justify-center">
              <HelpCircle
                size={150}
                className="text-[#017DB9] opacity-20"
                strokeWidth={1}
              />
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE PERGUNTAS - SOBRE A PLATAFORMA --- */}
        <section className="mb-8 border-t-2 pt-8">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Sobre a Plataforma
            </span>
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg text-left font-semibold">
                O que é a plataforma MeideSaquá?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                O <strong>MeideSaquá</strong> é uma iniciativa da Prefeitura
                Municipal de Saquarema, idealizada pela Secretaria de Governança
                e Sustentabilidade. É uma plataforma digital (vitrine) criada
                para reunir, organizar e divulgar os Microempreendedores
                Individuais (MEI’s) da cidade, fortalecendo a economia local.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Quais são os principais objetivos do MeideSaquá?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Divulgar e promover microempreendedores de Saquarema,
                    fortalecendo o eixo local de negócios.
                  </li>
                  <li>
                    Oferecer informações sobre produtos, serviços e contatos dos
                    MEI's.
                  </li>
                  <li>
                    Estimular a formalização dos pequenos negócios, pois a
                    plataforma é exclusiva para MEI’s regularizados no
                    município.
                  </li>
                  <li>
                    Criar um canal moderno, intuitivo e gratuito de
                    visibilidade para os MEI's.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como posso deixar uma avaliação para um MEI?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                Para deixar uma avaliação, você precisa ter um cadastro de
                usuário na plataforma e estar logado. Após fazer o{" "}
                <Link href="/login" className="text-blue-600 underline">
                  login
                </Link>
                , basta navegar até a página do MEI que deseja avaliar e usar a
                seção "Deixe aqui sua Avaliação".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* --- SEÇÃO DE CADASTRO MEI --- */}
        <section className="mb-8 border-t-2 pt-8">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Cadastro e Gestão do MEI
            </span>
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Quem pode se cadastrar na plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                A plataforma é destinada exclusivamente para{" "}
                <strong>
                  Microempreendedores Individuais (MEI’s) que estejam com o
                  cadastro cadastrado e regularizado no município de Saquarema
                </strong>
                .
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Sou MEI, mas meu cadastro não é de Saquarema. Posso participar?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                Como a plataforma foca no empreendedorismo local de Saquarema,
                seu cadastro de MEI precisa estar registrado no município. Caso
                não esteja, você deve primeiro solicitar a atualização do seu
                cadastro para o município de Saquarema. Recomendamos procurar a{" "}
                <strong>Sala do Empreendedor</strong> para mais informações.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como faço para CADASTRAR meu MEI na plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                1. Você precisa ter um cadastro de usuário e estar logado. Se
                não tiver,{" "}
                <Link href="/cadastro" className="text-blue-600 underline">
                  clique aqui para se cadastrar
                </Link>
                .
                <br />
                2. Acesse a página{" "}
                <Link
                  href="/cadastro-mei"
                  className="text-blue-600 underline"
                >
                  "Cadastro MEIdeSaquá"
                </Link>{" "}
                no menu.
                <br />
                3. No seletor, escolha a opção "Cadastrar meu MEI na
                plataforma".
                <br />
                4. Preencha o formulário completo com as informações do
                responsável, dados do negócio, descrições, e anexe os arquivos
                solicitados (CCMEI, Logo, Portfólio).
                <br />
                5. Após o envio, seu cadastro passará por uma análise do
                administrador antes de ser publicado.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como posso ATUALIZAR as informações de um MEI já cadastrado?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                1. Acesse a página{" "}
                <Link
                  href="/cadastro-mei"
                  className="text-blue-600 underline"
                >
                  "Cadastro MEIdeSaquá"
                </Link>
                .
                <br />
                2. Escolha a opção "Atualizar uma informação do meu MEI".
                <br />
                3. Você precisará preencher os dados de identificação
                obrigatórios (CNPJ, CPF do Responsável, etc.) para confirmar a
                autoria.
                <br />
                4. Em seguida, preencha{" "}
                <strong>apenas os campos que você deseja alterar</strong>.
                Campos deixados em branco não serão modificados. Se precisar
                mudar algo que não está no formulário (como categoria), use o
                campo "Outras Alterações".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como posso EXCLUIR meu MEI da plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                1. Acesse a página{" "}
                <Link
                  href="/cadastro-mei"
                  className="text-blue-600 underline"
                >
                  "Cadastro MEIdeSaquá"
                </Link>
                .
                <br />
                2. Escolha a opção "Excluir meu MEI da plataforma".
                <br />
                3. Você deverá preencher todos os campos de identificação (CNPJ,
                CPF, etc.) para confirmar sua solicitação.
                <br />
                4. Após a confirmação, sua solicitação de exclusão será enviada
                ao administrador para ser processada. Esta ação é permanente.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <FaleConoscoButton />
      </div>
    </div>
  );
}