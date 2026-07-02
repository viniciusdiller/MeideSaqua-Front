// Localização: meidesaqua-front/app/sitemap.ts

import { MetadataRoute } from "next";

// 1. URL PÚBLICA (para o Google)
const baseUrl = "https://meidesaqua.saquarema.rj.gov.br";

// 2. URL INTERNA (para o Next.js buscar os dados no backend)
// Prioridade:
// - SITEMAP_API_URL (ideal para build em servidor/CI)
// - NEXT_PUBLIC_API_URL
// - localhost
const backendApiUrl = (
  process.env.SITEMAP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3301"
).replace(/\/+$/, "");

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

const getErrorCode = (error: unknown): string | null => {
  const err = error as any;
  return err?.code || err?.cause?.code || null;
};

const getErrorMessage = (error: unknown): string => {
  const err = error as any;
  return (
    err?.message ||
    err?.cause?.message ||
    "Erro desconhecido ao buscar dados do sitemap"
  );
};

const fetchJsonSafe = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`${backendApiUrl}${path}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(
        `Sitemap: Falha ao buscar ${path}. Status: ${response.status}`,
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    const code = getErrorCode(error);
    const message = getErrorMessage(error);

    if (
      code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
      code === "SELF_SIGNED_CERT_IN_CHAIN"
    ) {
      console.warn(
        `Sitemap: Certificado SSL invalido ao acessar ${backendApiUrl}${path}. Ajuste SITEMAP_API_URL para uma URL interna HTTP/SSL valido.`,
      );
      return null;
    }

    console.warn(`Sitemap: Erro ao buscar ${path}: ${message}`);
    return null;
  }
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

  const categorias = await fetchJsonSafe<Categoria[]>(
    "/api/estabelecimentos/categorias",
  );

  if (Array.isArray(categorias)) {
    categoryUrls = categorias.map((categoria) => {
      const slug = slugify(categoria.nome);
      return {
        url: `${baseUrl}/categoria/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency:
          "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: 0.7,
      };
    });
  }

  // 3. Adicionar páginas dinâmicas (MEIs)
  let meiUrls: MetadataRoute.Sitemap = [];

  const estabelecimentosResponse = await fetchJsonSafe<any>(
    "/api/estabelecimentos",
  );

  const meisArray: Estabelecimento[] = Array.isArray(estabelecimentosResponse)
    ? estabelecimentosResponse
    : estabelecimentosResponse?.estabelecimentos || [];

  meiUrls = meisArray
    .filter((mei) => mei.estabelecimentoId)
    .map((mei: Estabelecimento) => {
      return {
        url: `${baseUrl}/categoria/${mei.estabelecimentoId}/MEI`,
        lastModified: new Date().toISOString(),
        changeFrequency:
          "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: 0.6,
      };
    });

  // 4. Retornar tudo
  return [...staticUrls, ...categoryUrls, ...meiUrls];
}
