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
  nomeResponsavel: string;
  cpfResponsavel: string;
  produtosImg?: ImagemProduto[];
  cnae: string;
  dados_atualizacao?: any;
  status: string;
  venda?: string;
  escala?: number;
  [key: string]: any;
}
