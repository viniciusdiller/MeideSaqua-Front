// Localização: meidesaqua-front/app/sitemap.ts

import { MetadataRoute } from "next";

// 1. URL PÚBLICA (para o Google)
const baseUrl = "https://meidesaqua.saquarema.rj.gov.br";

// 2. URL INTERNA (para o Next.js buscar os dados no backend)
// Em produção, ambos rodam no mesmo servidor, então o Next.js
// pode acessar o backend via localhost:3301.
const backendApiUrl = "http://localhost:3301";

const slugify = (text: string) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ /g, "_") // Substitui espaços por _
    .replace(/[^\w-]+/g, ""); // Remove caracteres especiais
};

type Categoria = {
  nome: string;
};

type Estabelecimento = {
  estabelecimentoId: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Adicionar suas páginas estáticas
  const staticUrls: MetadataRoute.Sitemap = [
    "/",
    "/sobre",
    "/contato",
    "/espaco-mei",
    "/login",
    "/cadastro",
    "/cadastro-mei",
  ].map((route) => ({
    url: `${baseUrl}${route}`, // URL pública
    lastModified: new Date().toISOString(),
    changeFrequency:
      "monthly" as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // 2. Adicionar suas páginas dinâmicas (Categorias)
  let categoryUrls: MetadataRoute.Sitemap = [];

  try {
    // --- CORREÇÃO AQUI ---
    // Usar backendApiUrl para o FETCH
    const response = await fetch(
      `${backendApiUrl}/api/estabelecimentos/categorias`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (response.ok) {
      const categorias: Categoria[] = await response.json();

      categoryUrls = categorias.map((categoria) => {
        const slug = slugify(categoria.nome);
        return {
          url: `${baseUrl}/categoria/${slug}`, // URL pública
          lastModified: new Date().toISOString(),
          changeFrequency:
            "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
          priority: 0.7,
        };
      });
    } else {
      console.error(
        `Sitemap: Falha ao buscar categorias. Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Sitemap: Erro de conexão ao buscar categorias:", error);
  }

  // 3. Adicionar páginas dinâmicas (MEIs)
  let meiUrls: MetadataRoute.Sitemap = [];

  try {
    // --- CORREÇÃO AQUI ---
    // Usar backendApiUrl para o FETCH
    const response = await fetch(`${backendApiUrl}/api/estabelecimentos`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const estabelecimentos: any[] = await response.json();

      // Seu código para extrair o array é bom, mas vamos garantir
      // que funciona se a API retornar { estabelecimentos: [...] } ou só [...]
      const meisArray: Estabelecimento[] = Array.isArray(estabelecimentos)
        ? estabelecimentos
        : (estabelecimentos as any).estabelecimentos || [];

      meiUrls = meisArray
        .filter((mei) => mei.estabelecimentoId)
        .map((mei: Estabelecimento) => {
          return {
            url: `${baseUrl}/categoria/${mei.estabelecimentoId}/MEI`, // URL pública
            lastModified: new Date().toISOString(),
            changeFrequency:
              "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
            priority: 0.6,
          };
        });
    } else {
      console.error(
        `Sitemap: Falha ao buscar estabelecimentos. Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Sitemap: Erro ao buscar estabelecimentos:", error);
  }

  // 4. Retornar tudo
  return [...staticUrls, ...categoryUrls, ...meiUrls];
}
