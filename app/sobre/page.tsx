export default function SobrePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <h1 className="text-4xl font-extrabold text-[#017DB9] mb-10 border-b-4 border-[#017DB9] inline-block pb-2">
          Sobre o Projeto
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            Como surgiu a ideia?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Tudo começou quando o desenvolvedor buscava um lugar para comer, mas encontrou dificuldades para descobrir as opções disponíveis e informações confiáveis sobre os estabelecimentos locais.  
            Essa experiência inspirou a criação do <strong>ExploreSaquá</strong>, um guia digital para facilitar o acesso a informações atualizadas e ajudar moradores e visitantes a explorar Saquarema com facilidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            Por que o projeto ajuda a população?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O <strong>ExploreSaquá</strong> conecta a comunidade local aos melhores serviços, estabelecimentos e pontos turísticos da cidade, promovendo o comércio regional e incentivando o desenvolvimento econômico.  
            Além disso, oferece uma plataforma acessível e gratuita, garantindo que todos tenham acesso fácil a informações essenciais para aproveitar o que Saquarema tem a oferecer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            Quais são os principais recursos do ExploreSaquá?
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>Informações atualizadas sobre restaurantes, pontos turísticos, trilhas, escolas, supermercados, transporte público, entre outros.</li>
            <li>Mapas interativos para facilitar a localização e navegação.</li>
            <li>Interface moderna e intuitiva, acessível em dispositivos móveis e desktops.</li>
            <li>Incentivo ao comércio local, com destaque para estabelecimentos cadastrados.</li>
            <li>Plataforma gratuita, voltada para moradores e visitantes da cidade.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            Como posso contribuir com o projeto?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Moradores e comerciantes podem contribuir cadastrando seus estabelecimentos, sugerindo novos locais ou enviando feedbacks para melhorar continuamente o ExploreSaquá.  
            Dessa forma, a plataforma cresce com a participação da comunidade, tornando-se cada vez mais completa e útil para todos.
          </p>
        </section>
      </div>
    </div>
  );
}
