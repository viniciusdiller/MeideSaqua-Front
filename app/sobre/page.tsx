export default function SobrePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <h1
          className=" text-4xl font-extrabold mb-10 inline-block pb-2 
  bg-gradient-to-r from-purple-600 to-orange-500 
  bg-no-repeat 
  [background-position:0_100%] 
  [background-size:100%_4px]"
        >
          <span className=" bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Sobre o Projeto
          </span>
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Como surgiu a ideia?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O <strong>MEIdeSaquá</strong> nasceu a partir da percepção de que
            muitos produtores locais de Saquarema enfrentavam dificuldades para
            divulgar seus serviços e alcançar novos clientes. Essa realidade
            evidenciou a necessidade de uma plataforma que conectasse
            diretamente os microempreendedores à comunidade e aos visitantes da
            cidade, criando novas oportunidades de crescimento e valorização do
            comércio local.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Por que o projeto ajuda a população?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O <strong>MEIdeSaquá</strong> fortalece a economia da cidade ao
            oferecer visibilidade para os produtores e microempreendedores,
            permitindo que eles expandam seus negócios e alcancem um público
            maior. Para a população, isso significa acesso a produtos e serviços
            de qualidade, com a comodidade de encontrar fornecedores locais de
            maneira rápida e confiável. Dessa forma, todos ganham: comerciantes,
            moradores e visitantes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Quais são os principais recursos do ExploreSaquá?
            </span>
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              Divulgação de microempreendedores e pequenos negócios da cidade.
            </li>
            <li>Informações detalhadas sobre produtos, serviços e contatos.</li>
            <li>
              Interface moderna e intuitiva, acessível em dispositivos móveis e
              desktops.
            </li>
            <li>Conexão direta entre produtores locais e consumidores.</li>
            <li>
              Plataforma gratuita que incentiva a economia criativa e
              sustentável de Saquarema.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Como posso contribuir com o projeto?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Produtores locais podem se cadastrar na plataforma, divulgando seus
            produtos e serviços para toda a comunidade. Moradores e visitantes
            podem apoiar consumindo do comércio local e compartilhando o{" "}
            <strong>MEIdeSaquá</strong>, ajudando a fortalecer ainda mais a
            economia da cidade. Assim, o projeto cresce de forma colaborativa e
            se torna um verdadeiro motor de desenvolvimento para Saquarema.
          </p>
        </section>
      </div>
    </div>
  );
}
