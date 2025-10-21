//SOBRE
import Link from "next/link";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800  py-20 px-6 sm:px-12">
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
            A Prefeitura Municipal de Saquarema, por meio da Secretaria
            Municipal de Governança e Sustentabilidade, apresenta o{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            uma plataforma inovadora pensada para os microempreendedores
            individuais (MEI’s) desta cidade. Mais que um site de catálogo, o{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            é um ambiente de valorização do talento local, da criatividade e da
            dedicação de quem empreende em Saquarema.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Este espaço foi criado com o objetivo de{" "}
            <strong>incentivar um ambiente de negócios favorável</strong> aos
            microempreendedores: seja para quem está começando, para quem está
            iniciando ou para quem já atua como MEI e deseja se fortalecer, se
            capacitar e atingir um maior potencial de clientes. Ele promove o{" "}
            <strong>fomento ao empreendedorismo</strong>, a valorização dos
            microempreendedores que muitas vezes enfrentam dificuldade em
            divulgar seus produtos ou serviços ou encontrar para quem vender,
            contribuindo para o aumento da longevidade dos pequenos negócios.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Além disso, o{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            oferece um{" "}
            <strong>tratamento diferenciado aos MEI’s de Saquarema</strong>,
            garantindo condições especiais de apoio e visibilidade na economia
            local. A plataforma funciona como uma ponte direta entre os
            microempreendedores da cidade e os potenciais consumidores —
            fortalecendo tanto a economia criativa quanto o comércio e serviços
            de proximidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Quais são os principais objetivos do MEIdeSaquá?
            </span>
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              Divulgar e promover microempreendedores de Saquarema, fortalecendo
              o eixo local de negócios.{" "}
            </li>
            <li>
              Oferecer informações sobre produtos, serviços, contatos e canais
              de conexão com clientes.
            </li>
            <li>
              {" "}
              Estimular a formalização dos pequenos negócios, uma vez que a
              plataforma é exclusiva para MEI’s{" "}
              <strong>
                cadastrados e regularizados no município de Saquarema
              </strong>
              .
            </li>
            <li>
              Criar novas oportunidades de crescimento para os MEI’s ao
              apresentar um canal moderno, intuitivo e gratuito de visibilidade.
            </li>
            <li>
              Fortalecer a economia local sustentando saberes, tradições e
              expressões culturais que fazem de Saquarema um lugar singular para
              empreender.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3 mt-10">
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              Por que a Secretaria de Governança e Sustentabilidade apoia esse
              projeto?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Conforme o regulamento municipal, a Secretaria de Governança e
            Sustentabilidade tem como competência formular políticas e ações
            para o desenvolvimento sustentável, integrando aspectos sociais,
            econômicos e de governança na gestão pública. Ao fomentar o
            empreendedorismo local, essa secretaria atua justamente na promoção
            da participação social, inovação, integração interinstitucional e
            sustentabilidade econômica da cidade, o que torna o{" "}
            <span className=" bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
              MEIdeSaquá
            </span>{" "}
            uma iniciativa alinhada com sua missão institucional. Além disso, o
            município de Saquarema tem investido em programas de apoio ao MEI e
            ao empreendedorismo local, reconhecendo que fortalecer pequenos
            negócios impacta diretamente no desenvolvimento econômico, na
            geração de emprego e renda no território.
          </p>
        </section>

        <section className="mb-8 border-t pt-8">
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
              <a className="text-blue-600 hover:underline">
                Cadastro MEIdeSaquá
              </a>
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
              <a className="text-blue-600 hover:underline">
                Cadastro MEIdeSaquá
              </a>
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
