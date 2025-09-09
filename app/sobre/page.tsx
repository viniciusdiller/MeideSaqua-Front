//SOBRE
import Link from "next/link";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <h1
          className=" text-4xl font-extrabold mb-10 inline-block pb-2
  bg-gradient-to-r from-[#017DB9] to-[#22c362]
  bg-no-repeat
  [background-position:0_100%]
  [background-size:100%_4px]"
        >
          <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
            MEIdeSaquá
          </span>
        </h1>

        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            O{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            é a vitrine digital dos Microempreendedores Individuais de
            Saquarema. Mais do que um site de produtos e serviços, é um espaço
            de valorização do talento local, da criatividade e da dedicação de
            quem empreende na nossa cidade.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Aqui, cada artesão, comerciante, prestador de serviço ou criador
            encontra um canal direto para apresentar seu trabalho à comunidade e
            aos visitantes. Assim, fortalecemos não apenas a economia local, mas
            também a perpetuação dos saberes, tradições e expressões culturais
            que tornam Saquarema única.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A Prefeitura Municipal de Saquarema acredita no poder do
            empreendedorismo como motor de desenvolvimento econômico e social.
            Por isso, apoia e cuida dos MEI’s, oferecendo suporte, capacitação e
            oportunidades de crescimento. O{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            é parte desse compromisso: um projeto que une inovação digital,
            identidade cultural e o fortalecimento dos negócios locais.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Quais são os principais recursos do MEIdeSaquá?
            </span>
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              Divulgação de microempreendedores e pequenos negócios da cidade.
            </li>
            <li>Informações sobre produtos, serviços e contatos.</li>
            <li>Interface moderna e intuitiva aos usuários.</li>
            <li>
              Conexão direta entre Microempreendedores de Saquarema e potenciais
              consumidores.
            </li>
            <li>
              Plataforma gratuita que incentiva a economia criativa e
              sustentável de Saquarema.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Sou um Microempreendedor Individual (MEI) cadastrado em Saquarema,
              como fazer parte da plataforma MEIdeSaquá?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Se você possui o seu registro como MEI cadastrado e atualizado,
            basta acessar a página “
            <Link href="/cadastro-mei" legacyBehavior>
              <a className="text-blue-600 hover:underline">Cadastro MEI</a>
            </Link>
            ”, lá você terá acesso ao formulário para incluir suas informações
            que posteriormente serão validadas pela equipe e disponibilizadas
            aqui.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Sou um Microempreendedor Individual (MEI) mas meu cadastro não é
              de Saquarema, posso fazer parte da plataforma?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            A plataforma{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            tem como objetivo principal fortalecer e fomentar o empreendedorismo
            local, valorizando os microempreendedores de Saquarema. Neste caso,
            para você estar apto a ter a divulgação na plataforma você deverá
            atualizar o seu cadastro do MEI para o município de Saquarema, em
            caso de dúvidas procure a Sala do Empreendedor para atualizar seu
            cadastro.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Estou cadastrado no MEIdeSaquá e desejo atualizar minhas
              informações ou retirar minha divulgação, como faço?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Na aba de “
            <Link href="/cadastro-mei" legacyBehavior>
              <a className="text-blue-600 hover:underline">Cadastro MEI</a>
            </Link>
            ”, haverá também a opção de atualizar ou excluir cadastro, basta que
            preencha com suas informações necessárias que faremos as
            atualizações ou exclusões solicitadas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Gostaria de deixar uma avaliação sobre um produto ou serviço
              referente a um MEI aqui da plataforma, como faço?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Após efetuar o cadastro ou login na plataforma, vá até a página do
            MEI ao qual deseja deixar sua avaliação e escreva na caixa de texto
            sua mensagem.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Desejo me formalizar como MEI, atualizar meu cadastro ou obter
              mais informações sobre MEI’s, como faço?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Você pode acessar o portal nacional de MEI’s no endereço eletrônico{" "}
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
                {/* Este span só será visível em telas PEQUENAS (extra-small) */}
                <span className="sm:hidden">
                  saladoempreendedor
                  <br />
                  @saquarema.rj.gov.br
                </span>

                {/* Este span só será visível em telas MAIORES (small e acima) */}
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
                R. Barão de Saquarema, n° 243 - Sala 5 - Centro, Saquarema - RJ,
                28990-772
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
                Av. Saquarema, 5483 - Porto da Roça, Saquarema - RJ, 28994-711
                (2° andar)
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
