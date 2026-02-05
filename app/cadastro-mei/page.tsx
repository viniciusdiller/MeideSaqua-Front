// app/cadastro-mei/page.tsx (Refatorado e Corrigido com Token)
"use client";

import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Spin,
  Row,
  Col,
  Result,
  Checkbox,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  cadastrarEstabelecimento,
  atualizarEstabelecimento,
  excluirEstabelecimento,
} from "@/lib/api";
import { Slider } from "@/components/ui/slider";
import { categories as categoryObjects } from "../page";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "./quill-styles.css";
import { set } from "date-fns";

// --- FUNÇÕES DE MÁSCARA ---
const maskCNAE = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{1})(\d{2})/, "$1/$2")
    .replace(/(\/\d{2})\d+?$/, "$1");
};

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const onFinishFailed = (errorInfo: any) => {
  if (!errorInfo.errorFields || errorInfo.errorFields.length === 0) {
    return;
  }

  const labelsComErro = errorInfo.errorFields
    .map((field: any) => {
      const fieldName = field.name[0];
      return campoLabels[fieldName] || fieldName;
    })
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index,
    );

  if (labelsComErro.length > 0) {
    const plural = labelsComErro.length > 1;
    const mensagem = `Por favor, preencha ${
      plural ? "os campos obrigatórios" : "o campo obrigatório"
    }: ${labelsComErro.join(", ")}.`;

    toast.error(mensagem);
  } else {
    toast.error("Por favor, verifique os campos obrigatórios.");
  }
};
// Função para remover emojis (do projeto ODS)
const stripEmojis = (value: string) => {
  if (!value) return "";
  return value.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    "",
  );
};

// --- DADOS (Movidos para fora do componente) ---
export const areasAtuacao = [
  "Entrega",
  "Retirada",
  "Entrega e Retirada",
  "Atendimento no Local",
  "Atendimento Online",
  "Atendimento Domiciliar",
  "Atendo todos os bairros de Saquarema",
  "Água Branca",
  "Alvorada",
  "Areal",
  "Asfalto Velho",
  "Aterrado",
  "Bacaxá",
  "Barra Nova",
  "Barreira",
  "Basiléa",
  "Bicuíba",
  "Bonsucesso",
  "Boqueirão",
  "Caixa d'Água",
  "Centro (Saquarema)",
  "Condado de Bacaxá",
  "Coqueiral",
  "Bairro de Fátima",
  "Engenho Grande",
  "Gravatá",
  "Guarani",
  "Ipitangas",
  "Itaúna",
  "Jaconé",
  "Jardim",
  "Jardim Ipitangas",
  "Leigos",
  "Madressilva",
  "Mombaça",
  "Morro dos Pregos",
  "Palmital",
  "Parque Marina",
  "Porto da Roça I",
  "Porto da Roça II",
  "Porto Novo",
  "Raia",
  "Retiro",
  "Rio d'Areia",
  "Rio Mole",
  "Sampaio Correia",
  "São Geraldo",
  "Serra de Mato Grosso",
  "Tinguí",
  "Verde Vale",
  "Vilatur",
  "Outro município",
];

export const categorias = categoryObjects.map((cat) => cat.title);

export const tagsPorCategoria: { [key: string]: string[] } = {
  "Artesanato e Criação Manual": [
    "Feito a Mão",
    "Peça Única",
    "Decoração",
    "Personalizado",
    "Presentes",
    "Crochê",
    "Biju",
    "Cerâmica",
    "Madeira",
    "Sustentável",
  ],
  "Beleza, Moda e Estética": [
    "Manicure",
    "Cabelo",
    "Maquiagem",
    "Roupas",
    "Acessórios",
    "Depilação",
    "Massagem",
    "Estética Facial",
    "Sobrancelha",
    "Cosméticos Naturais",
  ],
  "Comércio Local e Vendas": [
    "Entrega Rápida",
    "Loja Online",
    "Revendedor",
    "Produtos Importados",
    "Eletrônicos",
    "Materiais",
    "Varejo",
    "Atacado",
    "Promoção",
    "Frete Grátis",
  ],
  "Construção, Reforma e Manutenção": [
    "Eletricista",
    "Encanador",
    "Pintor",
    "Pedreiro",
    "Jardinagem",
    "Montador de Móveis",
    "Reparos",
    "Orçamento Grátis",
    "Piso",
    "Reforma de Casa",
  ],
  "Festas e Eventos": [
    "Decoração",
    "Buffet",
    "Fotografia",
    "Aniversário",
    "Casamento",
    "Música ao Vivo",
    "Aluguel de Mesas",
    "Recreação Infantil",
    "Eventos Corporativos",
    "Churrasco",
  ],
  "Gastronomia e Alimentação": [
    "Bolo",
    "Doces",
    "Comida Caseira",
    "Marmitex",
    "Delivery",
    "Salgados",
    "Vegetariano",
    "Vegano",
    "Cerveja Artesanal",
    "Petiscos",
  ],
  "Saúde, Bem-estar e Fitness": [
    "Personal Trainer",
    "Yoga",
    "Nutricionista",
    "Psicólogo",
    "Fisioterapia",
    "Medicina Natural",
    "Acupuntura",
    "Suplementos",
    "Aulas Online",
    "Espaço Zen",
  ],
  "Serviços Administrativos e Apoio": [
    "Contabilidade",
    "Consultoria",
    "Secretariado",
    "Digitalização",
    "Tradução",
    "Assessoria",
    "Finanças",
    "Currículo",
    "Escrita",
    "Organização",
  ],
  "Serviços Automotivos e Reparos": [
    "Mecânica",
    "Elétrica",
    "Borracharia",
    "Lava Jato",
    "Funilaria",
    "Guincho",
    "Revisão",
    "Pneu",
    "Motores",
    "Acessórios Automotivos",
  ],
  "Tecnologia e Serviços Digitais": [
    "Web Design",
    "Marketing Digital",
    "Redes Sociais",
    "Programação",
    "Manutenção PC",
    "Hospedagem",
    "Apps",
    "Consultoria TI",
    "SEO",
    "Criação de Vídeos",
  ],
  "Turismo, Cultura e Lazer": [
    "Guia Turístico",
    "Passeios",
    "Praia",
    "Hospedagem",
    "Aluguel de Bike",
    "Artesanato Local",
    "Aulas de Surf",
    "Trilhas",
    "Pousada",
    "Viagens",
  ],
  "Produtores Rurais e Atividades Agrícolas": [
    "Produtos Orgânicos",
    "Horta",
    "Feira Livre",
    "Frutas",
    "Vegetais",
    "Mel",
    "Gado",
    "Plantas Ornamentais",
    "Leite Fresco",
    "Ovos Caipiras",
  ],
};
export const canaisDeVendaOpcoes = [
  {
    label: "Redes Sociais (Instagram, Facebook, WhatsApp)",
    value: "Redes Sociais",
  },
  {
    label: "Marketplaces (Mercado Livre, Shopee, Amazon, etc.)",
    value: "Marketplaces",
  },
  {
    label: "Plataformas de serviços (GetNinjas, Workana, etc.)",
    value: "Plataformas de serviços",
  },
  {
    label: "Feiras e eventos (artesanato, gastronômicas, etc.)",
    value: "Feiras e eventos",
  },
  { label: "Loja própria / ponto fixo", value: "Loja própria / ponto fixo" },
  { label: "Atendimento em domicílio", value: "Atendimento em domicílio" },
  { label: "Boca a boca (recomendação)", value: "Boca a boca" },
  { label: "Outra forma", value: "Outra forma" },
];
const campoLabels: { [key: string]: string } = {
  nome_responsavel: "Nome Completo do Responsável",
  cpf_responsavel: "CPF do Responsável",
  emailEstabelecimento: "E-mail de Contato Principal",

  // Seção "Informações do Negócio"
  nomeFantasia: "Nome Fantasia",
  cnpj: "CNPJ",
  categoria: "Categoria Principal",
  ccmei: "Certificado CCMEI",
  tagsInvisiveis: "Tags de Busca Sugeridas",
  cnae: "CNAE (Atividade Principal)",
  venda: "Canais de Venda",
  escala: "Avaliação de Impacto (Escala)",

  // Seção "Contato e Localização"
  contatoEstabelecimento: "Telefone / WhatsApp do Estabelecimento",
  endereco: "Endereço Físico do estabelecimento (se houver)",
  areasAtuacao: "Áreas de Atuação",

  // Seção "Detalhes e Mídia"
  descricao: "Descrição do seu Serviço/Produto",
  descricaoDiferencial: "Qual o seu diferencial?",
  website: "Website (Opcional)",
  instagram: "Instagram (Opcional)",
  logo: "Sua Logo",
  produtos: "Imagens do seu Produto ou Serviço",

  // Seção Final
  confirmacao: "Confirmação de Veracidade e LGPD",
};

const { Option } = Select;
const { TextArea } = Input;

type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const CadastroMEIPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [ccmeiFileList, setCcmeiFileList] = useState<UploadFile[]>([]);
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState({
    title: "",
    subTitle: "",
  });
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toastShownRef = useRef(false);
  const [quillTextLength, setQuillTextLength] = useState(0);
  const MAX_QUILL_LENGTH = 500;

  const [sliderValue, setSliderValue] = useState(0);
  const escalaValue = Form.useWatch("escala", form);

  useEffect(() => {
    if (escalaValue !== undefined) {
      setSliderValue(escalaValue);
    }
  }, [escalaValue]);

  const getQuillTextLength = (value: string) => {
    if (typeof window === "undefined" || !value || value === "<p><br></p>")
      return 0;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    return (tempDiv.textContent || tempDiv.innerText || "").trim().length;
  };

  const handleFormValuesChange = (changedValues: any) => {
    if (changedValues.hasOwnProperty("descricao")) {
      const length = getQuillTextLength(changedValues.descricao);
      setQuillTextLength(length);
    }
  };

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);
  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);
  const handleCCMEIChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setCcmeiFileList(fileList);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!user) {
      if (!toastShownRef.current) {
        toast.error("Você precisa estar logado para cadastrar um MEI.");
        toastShownRef.current = true;
      }
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (flowStep === "register" || flowStep === "update") {
      const translateQuillToolbar = () => {
        const toolbar = document.querySelector(".ql-toolbar");
        if (!toolbar) return false;

        const boldButton = toolbar.querySelector(".ql-bold") as HTMLElement;
        if (boldButton && boldButton.title === "Negrito") {
          return true;
        }

        const translations: { [key: string]: string } = {
          ".ql-bold": "Negrito",
          ".ql-italic": "Itálico",
          ".ql-underline": "Sublinhado",
          ".ql-strike": "Riscado",
          '.ql-list[value="ordered"]': "Lista ordenada",
          '.ql-list[value="bullet"]': "Lista com marcadores",
          ".ql-link": "Inserir link",
          ".ql-clean": "Remover formatação",
          ".ql-header .ql-picker-label": "Normal",
        };

        Object.entries(translations).forEach(([selector, title]) => {
          const el = toolbar.querySelector(selector) as HTMLElement;
          if (el) {
            // Botões usam 'title'
            if (el.tagName === "BUTTON") {
              el.title = title;
            }
            // O seletor de Header usa 'data-label'
            else if (el.classList.contains("ql-picker-label")) {
              el.setAttribute("data-label", title);
            }
          }
        });

        toolbar
          .querySelectorAll(".ql-header .ql-picker-item")
          .forEach((item) => {
            const value = item.getAttribute("data-value");
            if (value === "1") item.setAttribute("data-label", "Título 1");
            else if (value === "2") item.setAttribute("data-label", "Título 2");
            else if (value === "3") item.setAttribute("data-label", "Título 3");
            else item.setAttribute("data-label", "Normal");
          });

        return (
          (toolbar.querySelector(".ql-bold") as HTMLElement)?.title ===
          "Negrito"
        );
      };

      const intervalId = setInterval(() => {
        const success = translateQuillToolbar();
        if (success) {
          clearInterval(intervalId);
        }
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [flowStep]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-3">
          <p className="text-xl font-medium text-gray-700">
            Verificando autenticação
          </p>
          <div className="flex space-x-1.5">
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  // Handler centralizado para limpeza de Emojis
  const handleStripEmojiChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    form.setFieldsValue({ [name]: stripEmojis(value) });
  };

  const handleMaskChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maskFn: (value: string) => string,
  ) => {
    const { name, value } = e.target;
    const cleanedValue = stripEmojis(value);
    form.setFieldsValue({ [name]: maskFn(cleanedValue) });
  };

  const resetAll = () => {
    form.resetFields();
    setLogoFileList([]);
    setPortfolioFileList([]);
    setCcmeiFileList([]);
    setFlowStep("initial");
    setQuillTextLength(0);
    setSliderValue(0);
  };

  // --- Funções de Submissão (Handlers) ---

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    if (!user?.token) {
      message.error("Sessão inválida. Por favor, faça login novamente.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "descricao" && (value === "<p><br></p>" || value === "")) {
          return;
        }
        if (
          value &&
          key !== "ccmeiFile" &&
          key !== "logo" &&
          key !== "produtos"
        ) {
          if (
            (key === "areasAtuacao" ||
              key === "tagsInvisiveis" ||
              key === "venda") &&
            Array.isArray(value)
          ) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append("logo", logoFileList[0].originFileObj);
      }
      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("produtos", file.originFileObj);
        }
      });
      if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
        formData.append("ccmei", ccmeiFileList[0].originFileObj);
      }

      await cadastrarEstabelecimento(formData, user.token);

      setSubmittedMessage({
        title: "Cadastro realizado com sucesso!",
        subTitle:
          "Sua solicitação foi recebida. Em breve seu negócio estará visível na plataforma para toda Saquarema.",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro. Por favor, tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (values: any) => {
    setLoading(true);
    if (!user?.token) {
      message.error("Sessão inválida. Por favor, faça login novamente.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      // **NOVO**: Verifica se nomeFantasia (campo de identificação) foi preenchido
      const { nomeFantasia } = values;
      if (!nomeFantasia) {
        message.error("O Nome Fantasia é obrigatório para identificação.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "descricao" && (value === "<p><br></p>" || value === "")) {
          return;
        }
        if (
          value &&
          key !== "ccmeiFile" &&
          key !== "portfolio" &&
          key !== "logo"
        ) {
          if (key === "locais" && Array.isArray(value)) {
            formData.append("areasAtuacao", value.join(", "));
          } else if (key === "tagsInvisiveis" && Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append("logo", logoFileList[0].originFileObj);
      }
      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("produtos", file.originFileObj);
        }
      });
      if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
        formData.append("ccmei", ccmeiFileList[0].originFileObj);
      }

      await atualizarEstabelecimento(formData, user.token);

      setSubmittedMessage({
        title: "Atualização enviada com sucesso!",
        subTitle:
          "Recebemos suas alterações. Elas serão analisadas e aplicadas em seu perfil em breve.",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao enviar a atualização.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (values: any) => {
    setLoading(true);
    if (!user?.token) {
      message.error("Sessão inválida. Por favor, faça login novamente.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const {
        nome_responsavel,
        cpf_responsavel,
        cnpj,
        emailEstabelecimento,
        // 'motivo' é opcional e não precisa ser verificado aqui
      } = values;

      if (
        !nome_responsavel ||
        !cpf_responsavel ||
        !cnpj ||
        !emailEstabelecimento
      ) {
        message.error("Todos os campos de identificação são obrigatórios.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "confirmacao" && key !== "ccmeiFile") {
          formData.append(key, value as string);
        }
      });

      if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
        formData.append("ccmei", ccmeiFileList[0].originFileObj);
      }

      await excluirEstabelecimento(formData, user.token);

      setSubmittedMessage({
        title: "Solicitação de exclusão recebida!",
        subTitle:
          "Sua solicitação foi registrada. A remoção do seu perfil da plataforma será processada em breve. Sentiremos sua falta!",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao solicitar a exclusão.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Funções de Renderização ---

  const customUploadAction = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setTimeout(() => {
      try {
        onSuccess(file);
      } catch (err) {
        onError(new Error("Erro no upload simulado"));
      }
    }, 500);
  };

  const commonTitle = (title: string) => (
    <h2
      className="relative text-2xl font-semibold text-gray-800 mb-6 pl-4 
        before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 
        before:bg-gradient-to-t from-[#017DB9] to-[#22c362]"
    >
      {title}
    </h2>
  );

  const renderInitialChoice = () => (
    <>
      <h1 className="text-4xl font-extrabold mb-6 inline-block pb-2 bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-no-repeat [background-position:0_100%] [background-size:100%_4px]">
        <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
          PORTAL DO MEI
        </span>
      </h1>
      <p className="text-gray-700 leading-relaxed text-lg mt-4 mb-8">
        Bem-vindo à Vitrine de Talentos Locais de Saquarema! Nossa missão é
        valorizar quem faz a cidade acontecer. Cadastre, atualize ou remova seu
        negócio quando precisar e faça parte dessa rede que conecta pessoas e
        fortalece a economia local.
      </p>
      <section className="flex flex-col border-t pt-6">
        <Form.Item
          layout="vertical"
          label={
            <span className="text-lg font-semibold">
              O que você deseja fazer?
            </span>
          }
        >
          <Select
            placeholder="Selecione uma ação"
            onChange={(value) => {
              setSelectedCategory(null);
              form.resetFields();
              setQuillTextLength(0);
              setFlowStep(value as FlowStep);
            }}
            size="large"
          >
            <Option value="register">Cadastrar meu MEI na plataforma</Option>
            <Option value="update">Atualizar uma informação do meu MEI</Option>
            <Option value="delete">Excluir meu MEI da plataforma</Option>
          </Select>
        </Form.Item>
      </section>
    </>
  );

  // --- INÍCIO DA MODIFICAÇÃO (validateQuill) ---
  /**
   * Valida o conteúdo do ReactQuill, verificando o 'required' e o 'maxLength'.
   * @param required
   */
  const validateQuill = (required: boolean) => (_: any, value: string) => {
    // Usa a nova função auxiliar
    const textContentLength = getQuillTextLength(value);

    if (required && textContentLength === 0) {
      return Promise.reject(new Error("Por favor, descreva seu projeto!"));
    }

    // Usa a nova constante
    if (textContentLength > MAX_QUILL_LENGTH) {
      return Promise.reject(
        new Error(
          `A descrição não pode ter mais de ${MAX_QUILL_LENGTH} caracteres (atualmente com ${textContentLength}).`,
        ),
      );
    }

    return Promise.resolve();
  };

  const renderRegisterForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleRegisterSubmit}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
      onFinishFailed={onFinishFailed}
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações do Responsável")}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nome_responsavel"
              label="Nome Completo do Responsável"
              rules={[
                { required: true, message: "Insira o nome do responsável!" },
              ]}
            >
              <Input
                name="nome_responsavel"
                placeholder="Ex: João da Silva"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cpf_responsavel"
              label="CPF do Responsável"
              rules={[
                { required: true, message: "O CPF é obrigatório!" },
                {
                  pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: "CPF incompleto ou inválido!",
                },
              ]}
            >
              <Input
                placeholder="000.000.000-00"
                name="cpf_responsavel"
                onChange={(e) => handleMaskChange(e, maskCPF)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="emailEstabelecimento"
          label="E-mail de Contato Principal"
          rules={[
            { required: true, message: "O e-mail é obrigatório!" },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de e-mail inválido!",
            },
          ]}
        >
          <Input
            name="emailEstabelecimento"
            placeholder="contato@email.com"
            onChange={handleStripEmojiChange}
          />
        </Form.Item>
      </section>

      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações do Negócio")}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nomeFantasia"
              label="Nome Fantasia"
              rules={[
                { required: true, message: "Insira o nome do seu negócio!" },
              ]}
            >
              <Input
                name="nomeFantasia"
                placeholder="Ex: Salão da Maria"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cnpj"
              label="CNPJ"
              rules={[
                { required: true, message: "O CNPJ é obrigatório!" },
                {
                  pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                  message: "CNPJ incompleto ou inválido!",
                },
              ]}
            >
              <Input
                placeholder="00.000.000/0001-00"
                name="cnpj"
                onChange={(e) => handleMaskChange(e, maskCNPJ)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="categoria"
              label="Categoria Principal"
              rules={[{ required: true, message: "Selecione uma categoria!" }]}
            >
              <Select
                placeholder="Selecione a categoria principal"
                onSelect={(value: string) => setSelectedCategory(value)}
                onChange={() => form.setFieldsValue({ tagsInvisiveis: [] })}
              >
                {categorias.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ccmeiFile"
              label="Certificado CCMEI"
              rules={[
                {
                  required: true,
                  message: "O Certificado CCMEI é obrigatório!",
                },
                () => ({
                  validator(_, value) {
                    if (ccmeiFileList.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Envie o Certificado CCMEI (PDF ou Imagem)!"),
                    );
                  },
                }),
              ]}
              help="Anexe o Certificado de Condição de Microempreendedor Individual (PDF ou Imagem)."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={ccmeiFileList}
                onChange={handleCCMEIChange}
                listType="text"
                maxCount={1}
                accept=".pdf,.jpg,.jpeg,.png"
              >
                <Button icon={<UploadOutlined />}>Carregar Arquivo</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        {selectedCategory ? (
          <Form.Item
            name="tagsInvisiveis"
            label={`Tags de Busca Sugeridas (${selectedCategory})`}
            help="Selecione no máximo 5 tags para facilitar a busca do seu negócio."
            rules={[
              { required: true, message: "Selecione pelo menos uma tag!" },
              {
                validator: (_, value) =>
                  value && value.length > 5
                    ? Promise.reject(new Error("Selecione no máximo 5 tags!"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Selecione até 5 tags"
              maxTagCount={5}
            >
              {tagsPorCategoria[selectedCategory]?.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <p className="text-gray-600 mb-6 mt-2">
            *Selecione uma Categoria na seção "Informações do Negócio" para ver
            as Tags sugeridas.*
          </p>
        )}
        <Form.Item
          name="cnae"
          label="CNAE (Atividade Principal)"
          rules={[
            { required: true, message: "O CNAE é obrigatório!" },
            {
              pattern: /^\d{4}-\d\/\d{2}$/,
              message: "CNAE incompleto ou inválido!",
            },
          ]}
        >
          <Input
            placeholder="0000-0/00"
            name="cnae"
            onChange={(e) => handleMaskChange(e, maskCNAE)}
          />
        </Form.Item>
        <Form.Item
          name="venda"
          label="Como você vende ou divulga seus produtos ou serviços?"
          className="mb-10"
          rules={[
            { required: true, message: "Selecione pelo menos um canal." },
          ]}
          help="Selecione todas as opções que se aplicam."
        >
          <Checkbox.Group
            options={canaisDeVendaOpcoes}
            className="flex flex-col space-y-1 ml-4"
          />
        </Form.Item>

        {/* Pergunta 2: Escala (Slider) - A "Boa Ideia" */}
        <Form.Item
          rules={[{ required: true, message: "Por favor, avalie o impacto!" }]}
          name="escala"
          label="Diga o quanto você acredita que ter seu perfil no MEIdeSaquá irá impulsionar seu negócio."
          className="mt-10"
          help="Em uma escala de 0 a 10, onde 0 = nenhum impacto e 10 = impacto muito positivo"
        >
          <>
            <Slider
              value={[sliderValue]}
              max={10}
              step={1}
              onValueChange={(value) => {
                setSliderValue(value[0]);
                form.setFieldsValue({ escala: value[0] });
              }}
            />
            {/* Mostrador numérico */}
            <div className="text-center font-bold text-lg text-primary mt-2">
              {sliderValue}
            </div>
          </>
        </Form.Item>
      </section>

      <section className="mb-8 border-t pt-4">
        {commonTitle("Contato e Localização")}
        <Form.Item
          name="contatoEstabelecimento"
          label="Telefone / WhatsApp do Estabelecimento"
          rules={[
            { required: true, message: "Insira um contato!" },
            {
              pattern: /^\(\d{2}\) \d{5}-\d{4}$/,
              message: "Telefone incompleto ou inválido!",
            },
          ]}
        >
          <Input
            placeholder="(22) 99999-9999"
            name="contatoEstabelecimento"
            onChange={(e) => handleMaskChange(e, maskPhone)}
          />
        </Form.Item>
        <Form.Item
          name="endereco"
          label="Endereço Físico do estabelecimento (se houver)"
        >
          <Input
            name="endereco"
            placeholder="Este endereço aparecerá no perfil do seu negócio, para o público."
            onChange={handleStripEmojiChange}
          />
        </Form.Item>
        <Form.Item
          name="areasAtuacao"
          label="Áreas de Atuação"
          className="mt-10"
          rules={[
            { required: true, message: "Selecione pelo menos uma área!" },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Selecione os bairros que você atende"
          >
            {areasAtuacao.map((area) => (
              <Option key={area} value={area}>
                {area}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </section>

      <section className="mb-8 border-t pt-5">
        {commonTitle("Detalhes e Mídia")}
        <Form.Item
          name="descricao"
          label="Descrição do seu Serviço/Produto"
          rules={[
            {
              validator: validateQuill(true),
              required: true,
              message: "Por favor, descreva seu projeto!",
            },
          ]}
          help={
            <div className="flex justify-end w-full">
              <span
                className={
                  quillTextLength > MAX_QUILL_LENGTH
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                }
              >
                {quillTextLength}/{MAX_QUILL_LENGTH}
              </span>
            </div>
          }
        >
          <ReactQuill
            theme="snow"
            modules={quillModules}
            placeholder="Conte um pouco sobre o seu negócio! Descreva os principais produtos que você oferece ou os serviços que realiza."
            style={{ minHeight: "10px" }}
          />
        </Form.Item>

        <Form.Item
          name="descricaoDiferencial"
          label="Qual o seu diferencial?"
          rules={[
            {
              required: true,
              message: "Por favor, informe o seu diferencial!",
            },
          ]}
        >
          <TextArea
            name="descricaoDiferencial"
            rows={2}
            showCount
            maxLength={130}
            placeholder="Descreva brevemente qual é o atrativo do seu produto ou serviço. (Em até 130 caracteres)"
            onChange={handleStripEmojiChange}
          />
        </Form.Item>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="website" label="Website (Opcional)">
              <Input
                name="website"
                placeholder="Cole o link da sua página"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="instagram" label="Instagram (Opcional)">
              <Input
                name="instagram"
                placeholder="Cole o link do seu perfil"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Sua Logo"
              help="Envie 1 imagem para o perfil. (.png, .jpg, .jpeg)"
            >
              <Upload
                customRequest={customUploadAction}
                fileList={logoFileList}
                onChange={handleLogoChange}
                listType="picture"
                maxCount={1}
                accept="image/png, image/jpeg, image/jpg"
              >
                <Button icon={<UploadOutlined />}>Carregar Logo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Imagens do seu Produto ou Serviço"
              help="Envie até 4 imagens. (.png, .jpg, .jpeg)"
              rules={[
                { required: true, message: "Por favor, Adicione imagens!" },
              ]}
            >
              <Upload
                customRequest={customUploadAction}
                fileList={portfolioFileList}
                onChange={handlePortfolioChange}
                listType="picture"
                multiple
                maxCount={4}
                accept="image/png, image/jpeg, image/jpg image/webp"
              >
                <Button icon={<UploadOutlined />}>Carregar Portfólio</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Form.Item
            name="confirmacao"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Você precisa confirmar esta caixa."),
                      ),
              },
            ]}
          >
            <Checkbox>
              Confirmo que as informações são verdadeiras e de minha
              responsabilidade. Estou ciente de que poderão ser usadas pela
              Prefeitura para divulgação e apoio ao empreendedorismo em
              Saquarema, de acordo com a Lei Geral de Proteção de Dados.
            </Checkbox>
          </Form.Item>
        </Row>
      </section>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ height: 45, fontSize: "1rem" }}
        >
          Enviar Cadastro
        </Button>
      </Form.Item>
    </Form>
  );

  const renderUpdateForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdateSubmit}
      autoComplete="off"
      onFinishFailed={onFinishFailed}
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Identificação do Negócio")}
        <p className="text-gray-600 mb-6 -mt-4">
          Para iniciar a atualização, confirme os dados de identificação do
          negócio e do responsável.
        </p>

        {/* --- INÍCIO DA ALTERAÇÃO --- */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nome_responsavel"
              label="Nome Completo do Responsável"
              rules={[
                {
                  required: true,
                  message: "O nome é obrigatório para identificação!",
                },
              ]}
            >
              <Input
                name="nome_responsavel"
                placeholder="Nome Completo"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cpf_responsavel"
              label="CPF do Responsável"
              rules={[
                {
                  required: true,
                  message: "O CPF é obrigatório para identificação!",
                },
                {
                  pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: "CPF inválido!",
                },
              ]}
            >
              <Input
                placeholder="000.000.000-00"
                name="cpf_responsavel"
                onChange={(e) => handleMaskChange(e, maskCPF)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* CAMPO ADICIONADO AQUI */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nomeFantasia"
              label="Nome Fantasia do Negócio"
              rules={[
                {
                  required: true,
                  message: "O Nome Fantasia é obrigatório para identificação!",
                },
              ]}
            >
              <Input
                name="nomeFantasia"
                placeholder="Nome Fantasia"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cnpj"
              label="CNPJ do Negócio"
              rules={[
                {
                  required: true,
                  message: "O CNPJ é obrigatório para identificação!",
                },
                {
                  pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                  message: "CNPJ inválido!",
                },
              ]}
            >
              <Input
                placeholder="00.000.000/0001-00"
                name="cnpj"
                onChange={(e) => handleMaskChange(e, maskCNPJ)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="emailEstabelecimento"
              label="E-mail de Contato Principal"
              rules={[
                {
                  required: true,
                  message: "O e-mail é obrigatório para identificação!",
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido!",
                },
              ]}
            >
              <Input
                name="emailEstabelecimento"
                placeholder="contato@email.com"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ccmeiFile"
              label="Certificado CCMEI Atual"
              rules={[
                {
                  required: true,
                  message:
                    "O Certificado CCMEI é obrigatório para identificação!",
                },
                () => ({
                  validator(_, value) {
                    if (ccmeiFileList.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Envie o Certificado CCMEI (PDF ou Imagem)!"),
                    );
                  },
                }),
              ]}
              help="Anexe a cópia mais recente do Certificado de Condição de Microempreendedor Individual (PDF/Imagem)."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={ccmeiFileList}
                onChange={handleCCMEIChange}
                listType="text"
                maxCount={1}
                accept=".pdf,.jpg,.jpeg,.png"
              >
                <Button icon={<UploadOutlined />}>Carregar CCMEI</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        {/* --- FIM DA ALTERAÇÃO --- */}
      </section>

      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações para Atualizar")}
        <p className="text-gray-600 mb-6 -mt-4">
          Preencha apenas os campos que deseja alterar. Os campos deixados em
          branco não serão modificados.
        </p>

        <Form.Item
          label="Nova Logo (Opcional)"
          help="Envie 1 nova imagem para substituir a logo atual. (.png, .jpg, .jpeg)"
        >
          <Upload
            customRequest={customUploadAction}
            fileList={logoFileList}
            onChange={handleLogoChange}
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg, image/jpg image/webp"
          >
            <Button icon={<UploadOutlined />}>Carregar Nova Logo</Button>
          </Upload>
        </Form.Item>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="contatoEstabelecimento"
              label="Novo Telefone / WhatsApp"
              rules={[
                {
                  pattern: /^\(\d{2}\) \d{5}-\d{4}$/,
                  message: "Telefone inválido!",
                },
              ]}
            >
              <Input
                placeholder="(22) 99999-9999"
                name="contatoEstabelecimento"
                onChange={(e) => handleMaskChange(e, maskPhone)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="locais" label="Novas Áreas de Atuação">
          <Select mode="multiple" allowClear placeholder="Selecione os bairros">
            {areasAtuacao.map((area) => (
              <Option key={area} value={area}>
                {area}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="descricaoDiferencial"
          label="Novo Diferencial (Resumo)"
        >
          <TextArea
            name="descricaoDiferencial"
            rows={2}
            showCount
            maxLength={130}
            placeholder="Descreva brevemente qual é o atrativo do seu produto ou serviço."
            onChange={handleStripEmojiChange}
          />
        </Form.Item>

        <Form.Item
          name="descricao"
          label="Nova Descrição do projeto"
          rules={[{ validator: validateQuill(false) }]}
          // A prop 'help' foi substituída por este JSX:
          help={
            <div className="flex justify-between w-full">
              <span>Se preenchido, substituirá a descrição atual.</span>
              <span
                className={
                  quillTextLength > MAX_QUILL_LENGTH
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                }
              >
                {quillTextLength}/{MAX_QUILL_LENGTH}
              </span>
            </div>
          }
        >
          <ReactQuill
            theme="snow"
            modules={quillModules}
            placeholder="Fale um pouco mais detalhadamente sobre o que o seu projeto faz..."
            style={{ minHeight: "10px" }}
          />
        </Form.Item>

        <Form.Item
          name="outrasAlteracoes"
          label="Outras Alterações (Opcional)"
          help="Se precisar alterar algo que não está no formulário (ex: Categoria, Endereço, Instagram, etc.), descreva aqui."
        >
          <TextArea
            name="outrasAlteracoes"
            rows={3}
            placeholder="Ex: Por favor, alterar o Instagram para @novo_mei e o endereço para Rua Nova, 123."
            onChange={handleStripEmojiChange}
          />
        </Form.Item>

        <Form.Item
          name="tagsInvisiveis"
          label="Novas Tags de Busca (Até 5)"
          help="Selecione até 5 tags. As novas tags substituirão as atuais."
          rules={[
            {
              validator: (_, value) =>
                value && value.length > 5
                  ? Promise.reject(new Error("Selecione no máximo 5 tags!"))
                  : Promise.resolve(),
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Selecione as tags"
            maxTagCount={5}
          >
            {[...new Set(Object.values(tagsPorCategoria).flat())].map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="portfolio"
          label="Novas Fotos do Portfólio (até 4)"
          help="As imagens enviadas aqui irão substituir as atuais. (.png, .jpg, .jpeg)"
        >
          <Upload
            customRequest={customUploadAction}
            fileList={portfolioFileList}
            onChange={handlePortfolioChange}
            listType="picture"
            multiple
            maxCount={4}
            accept="image/png, image/jpeg, image/jpg image/webp"
          >
            <Button icon={<UploadOutlined />}>Carregar Novas Imagens</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="confirmacao"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Você precisa confirmar esta caixa."),
                    ),
            },
          ]}
        >
          <Checkbox>
            Confirmo que as informações são verdadeiras e de minha
            responsabilidade. Estou ciente de que poderão ser usadas pela
            Prefeitura para divulgação e apoio ao empreendedorismo em Saquarema,
            de acordo com a Lei Geral de Proteção de Dados.
          </Checkbox>
        </Form.Item>
      </section>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ height: 45, fontSize: "1rem" }}
        >
          Enviar Atualização
        </Button>
      </Form.Item>
    </Form>
  );

  const renderDeleteForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleDeleteSubmit}
      autoComplete="off"
      onFinishFailed={onFinishFailed}
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Exclusão de Cadastro MEI")}
        <p className="text-red-700 bg-red-50 p-4 rounded-md mb-6 -mt-2">
          <b>Atenção:</b> Esta ação é permanente e removerá seu negócio da nossa
          plataforma. Para voltar, será necessário um novo cadastro. Para
          prosseguir, confirme sua identidade.
        </p>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nome_responsavel"
              label="Nome Completo do Responsável"
              rules={[
                {
                  required: true,
                  message: "O nome é obrigatório para identificação!",
                },
              ]}
            >
              <Input
                name="nome_responsavel"
                placeholder="Nome Completo"
                onChange={handleStripEmojiChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cpf_responsavel"
              label="CPF do Responsável"
              rules={[
                {
                  required: true,
                  message: "O CPF é obrigatório para identificação!",
                },
                {
                  pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: "CPF inválido!",
                },
              ]}
              help="Apenas aceitaremos a exclusão caso o CPF seja correspondente ao do cadastro."
            >
              <Input
                placeholder="000.000.000-00"
                name="cpf_responsavel"
                onChange={(e) => handleMaskChange(e, maskCPF)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="cnpj"
              label="CNPJ do Negócio"
              rules={[
                {
                  required: true,
                  message: "O CNPJ é obrigatório para identificação!",
                },
                {
                  pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                  message: "CNPJ inválido!",
                },
              ]}
            >
              <Input
                placeholder="00.000.000/0001-00"
                name="cnpj"
                onChange={(e) => handleMaskChange(e, maskCNPJ)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ccmeiFile"
              label="Certificado CCMEI"
              rules={[
                {
                  required: true,
                  message:
                    "O Certificado CCMEI é obrigatório para identificação!",
                },
                () => ({
                  validator(_, value) {
                    if (ccmeiFileList.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Envie o Certificado CCMEI (PDF ou Imagem)!"),
                    );
                  },
                }),
              ]}
              help="Anexe a cópia mais recente do Certificado de Condição de Microempreendedor Individual (PDF/Imagem)."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={ccmeiFileList}
                onChange={handleCCMEIChange}
                listType="text"
                maxCount={1}
                accept=".pdf,.jpg,.jpeg,.png"
              >
                <Button icon={<UploadOutlined />}>Carregar CCMEI</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="emailEstabelecimento"
          label="E-mail de Contato Principal"
          rules={[
            {
              required: true,
              message: "O e-mail é obrigatório para identificação!",
            },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "E-mail inválido!",
            },
          ]}
        >
          <Input
            name="emailEstabelecimento"
            placeholder="contato@email.com"
            onChange={handleStripEmojiChange}
          />
        </Form.Item>

        <Form.Item name="motivo" label="Motivo da exclusão (Opcional)">
          <TextArea
            name="motivo"
            rows={3}
            placeholder="Sua opinião é importante para nós. Se puder, nos diga por que está saindo."
            onChange={handleStripEmojiChange}
          />
        </Form.Item>
        <Form.Item
          name="confirmacao"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Você precisa confirmar a exclusão!"),
                    ),
            },
          ]}
        >
          <Checkbox>
            Sim, eu entendo que esta ação é irreversível e desejo excluir meu
            cadastro.
          </Checkbox>
        </Form.Item>
      </section>
      <Form.Item>
        <Button
          type="primary"
          danger
          htmlType="submit"
          block
          loading={loading}
          style={{ height: 45, fontSize: "1rem" }}
        >
          Confirmar Exclusão MEI
        </Button>
      </Form.Item>
    </Form>
  );

  const renderSuccess = () => (
    <Result
      status="success"
      title={submittedMessage.title}
      subTitle={submittedMessage.subTitle}
      extra={[
        <Button type="primary" key="console" onClick={resetAll}>
          Voltar ao Início
        </Button>,
      ]}
    />
  );

  const renderContent = () => {
    switch (flowStep) {
      case "register":
        return renderRegisterForm();
      case "update":
        return renderUpdateForm();
      case "delete":
        return renderDeleteForm();
      case "submitted":
        return renderSuccess();
      case "initial":
      default:
        return renderInitialChoice();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <Spin spinning={loading} tip="A processar...">
          {flowStep !== "initial" && flowStep !== "submitted" && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => setFlowStep("initial")}
              className="mb-6"
            >
              Voltar ao início
            </Button>
          )}
          {renderContent()}
        </Spin>
      </div>
    </div>
  );
};

export default CadastroMEIPage;
