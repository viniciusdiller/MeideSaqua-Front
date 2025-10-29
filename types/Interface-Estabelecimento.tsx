// types/Interface-Estabelecimento.ts

// Copiada do seu app/admin/dashboard/page.tsx
export interface ImagemProduto {
  url: string;
}

// Copiada e adaptada do seu app/admin/dashboard/page.tsx
// Adicionei campos que pareciam estar sendo usados (como categoria)
export interface Estabelecimento {
  estabelecimentoId: number;
  nomeFantasia: string;
  cnpj: string;
  categoria: string; // Adicionado para a lógica de abas
  logoUrl?: string;
  ccmeiUrl?: string;
  imagensProduto?: ImagemProduto[];
  dados_atualizacao?: any;
  status: string;
  [key: string]: any; // Mantido para flexibilidade
}