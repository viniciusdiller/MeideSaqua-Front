// types/Interface-Estabelecimento.ts

export interface ImagemProduto {
  url: string;
}

export interface Estabelecimento {
  estabelecimentoId: number;
  nomeFantasia: string;
  cnpj: string;
  categoria: string;
  logoUrl?: string;
  ccmeiUrl?: string;
  
  // --- CORREÇÃO AQUI ---
  // Alterado de 'imagensProduto' para 'produtosImg' para
  // corresponder ao seu backend
  produtosImg?: ImagemProduto[]; 
  // --- FIM DA CORREÇÃO ---

  dados_atualizacao?: any;
  status: string;
  [key: string]: any; 
}