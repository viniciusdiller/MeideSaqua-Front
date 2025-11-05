// app/cadastro-mei/page.tsx
"use client";

import React, { useState } from "react";
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

// --- FUNÇÕES DE MÁSCARA (Mantidas) ---
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- API (Mantida do original MeideSaquá) ---
const api = {
  cadastrarEstabelecimento: async (formData: FormData) => {
    const response = await fetch(`${API_URL}/api/estabelecimentos`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao cadastrar.");
    }
    return response.json();
  },

  atualizarEstabelecimento: async (formData: FormData) => {
    const response = await fetch(
      `${API_URL}/api/estabelecimentos/solicitar-atualizacao`,
      {
        method: "PUT",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao enviar atualização.");
    }
    return response.json();
  },

  excluirEstabelecimento: async (formData: FormData) => {
    const response = await fetch(
      `${API_URL}/api/estabelecimentos/solicitar-exclusao`,
      {
        method: "POST",
        body: formData, // Enviar como FormData para suportar o anexo
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao solicitar exclusão.");
    }
    return response.json();
  },
};

// --- DADOS (Mantidos do original MeideSaquá) ---
export const areasAtuacao = [
  "Entrega",
  "Retirada",
  "Entrega e Retirada",
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
export const categorias = [
  "Artesanato e Criação Manual",
  "Beleza, Moda e Estética",
  "Comércio Local e Vendas",
  "Construção, Reforma e Manutenção",
  "Festas e Eventos",
  "Gastronomia e Alimentação",
  "Saúde, Bem-estar e Fitness",
  "Serviços Administrativos e Apoio",
  "Serviços Automotivos e Reparos",
  "Tecnologia e Serviços Digitais",
  "Turismo, Cultura e Lazer",
  "Produtores Rurais e Atividades Agrícolas",
];

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
// --- FIM DOS DADOS ---

const { Option } = Select;
const { TextArea } = Input;

type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";

const CadastroMEIPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [ccmeiFileList, setCcmeiFileList] = useState<UploadFile[]>([]); // Específico do MEI
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState({
    title: "",
    subTitle: "",
  });
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);
  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);
  const handleCCMEIChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setCcmeiFileList(fileList); // Específico do MEI

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!user) {
      toast.error("Você precisa estar logado para cadastrar um MEI.");
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  const handleMaskChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maskFn: (value: string) => string
  ) => {
    const { name, value } = e.target;
    form.setFieldsValue({ [name]: maskFn(value) });
  };

  const resetAll = () => {
    form.resetFields();
    setLogoFileList([]);
    setPortfolioFileList([]);
    setCcmeiFileList([]); // Específico do MEI
    setFlowStep("initial");
  };

  // --- Funções de Submissão (Mantidas do original MeideSaquá) ---

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (
          value &&
          key !== "ccmeiFile" && // Específico do MEI
          key !== "logo" &&
          key !== "produtos"
        ) {
          if (
            (key === "areasAtuacao" || key === "tagsInvisiveis") &&
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
          formData.append("produtos", file.originFileObj); // Nome do campo 'produtos'
        }
      });

      if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
        formData.append("ccmei", ccmeiFileList[0].originFileObj); // Específico do MEI
      }

      await api.cadastrarEstabelecimento(formData);

      setSubmittedMessage({
        title: "Cadastro realizado com sucesso!",
        subTitle:
          "Sua solicitação foi recebida. Em breve seu negócio estará visível na plataforma para toda Saquarema.",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // NENHUMA MUDANÇA NECESSÁRIA AQUI
  // O loop "Object.entries" já pega o novo campo 'outrasAlteracoes'
  const handleUpdateSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (
          value &&
          key !== "ccmeiFile" && // Específico do MEI
          key !== "portfolio" && // 'portfolio' é o nome do campo no formulário de update
          key !== "logo"
        ) {
          if (key === "locais" && Array.isArray(value)) {
            // 'locais' é o nome do campo no formulário de update
            formData.append("areasAtuacao", value.join(", "));
          } else if (key === "tagsInvisiveis" && Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
            // O campo 'outrasAlteracoes' será pego aqui
          }
        }
      });

      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append("logo", logoFileList[0].originFileObj);
      }

      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("produtos", file.originFileObj); // Backend espera 'produtos'
        }
      });

      if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
        formData.append("ccmei", ccmeiFileList[0].originFileObj); // Específico do MEI
      }

      await api.atualizarEstabelecimento(formData);

      setSubmittedMessage({
        title: "Atualização enviada com sucesso!",
        subTitle:
          "Recebemos suas alterações. Elas serão analisadas e aplicadas em seu perfil em breve.",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao enviar a atualização."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "confirmacao" && key !== "ccmeiFile") {
          formData.append(key, value as string);
        }
      });

      if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
        formData.append("ccmei", ccmeiFileList[0].originFileObj); // Específico do MEI
      }

      await api.excluirEstabelecimento(formData);

      setSubmittedMessage({
        title: "Solicitação de exclusão recebida!",
        subTitle:
          "Sua solicitação foi registrada. A remoção do seu perfil da plataforma será processada em breve. Sentiremos sua falta!",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao solicitar a exclusão."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Funções de Renderização (Mantidas do original MeideSaquá) ---

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
        before:bg-gradient-to-t from-[#017DB9] to-[#22c362]" // Estilo MeideSaquá
    >
      {title}
    </h2>
  );

  const renderInitialChoice = () => (
    <>
      {/* Textos e Estilos do MeideSaquá */}
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
            onChange={(value) => setFlowStep(value as FlowStep)}
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

  const renderRegisterForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleRegisterSubmit}
      autoComplete="off"
    >
      {/* Campos Específicos do MEI (Mantidos) */}
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
              <Input placeholder="Ex: João da Silva" />
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
          <Input placeholder="contato@email.com" />
        </Form.Item>
      </section>

      {/* Campos Específicos do MEI (Mantidos) */}
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
              <Input placeholder="Ex: Salão da Maria" />
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
                      new Error("Envie o Certificado CCMEI (PDF ou Imagem)!")
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
      </section>

      {/* Campos Específicos do MEI (Mantidos) */}
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
        <Form.Item name="endereco" label="Endereço Físico (se houver)">
          <Input placeholder="Rua, Bairro, Nº" />
        </Form.Item>
        <Form.Item
          name="areasAtuacao"
          label="Áreas de Atuação"
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

      {/* Campos Específicos do MEI (Mantidos) */}
      <section className="mb-8 border-t pt-5">
        {commonTitle("Detalhes e Mídia")}
        <Form.Item
          name="descricao"
          label="Descrição do seu Serviço/Produto"
          rules={[
            {
              required: true,
              message: "Por favor, descreva seu produto ou serviço!",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Fale um pouco sobre o que você faz, quais produtos você vende ou tipo de serviço que realiza. Essa é a informação que os seus futuros clientes irão ver."
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
            rows={2}
            placeholder="Descreva brevemente qual é o atrativo do seu produto ou serviço."
          />
        </Form.Item>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="website" label="Website (Opcional)">
              <Input placeholder="Cole o link da sua página" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="instagram" label="Instagram (Opcional)">
              <Input placeholder="Cole o link do seu perfil" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Sua Logo" help="Envie 1 imagem para o perfil.">
              <Upload
                customRequest={customUploadAction}
                fileList={logoFileList}
                onChange={handleLogoChange}
                listType="picture"
                maxCount={1}
                accept="image/png, image/jpeg, image/webp"
              >
                <Button icon={<UploadOutlined />}>Carregar Logo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Imagens do seu Produto ou Serviço"
              help="Envie até 4 imagens."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={portfolioFileList}
                onChange={handlePortfolioChange}
                listType="picture"
                multiple
                maxCount={4}
                accept="image/png, image/jpeg, image/webp"
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
                        new Error("Você precisa confirmar esta caixa.")
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
    >
      {/* Campos Específicos do MEI (Mantidos) */}
      <section className="mb-8 border-t pt-4">
        {commonTitle("Identificação do Negócio")}
        <p className="text-gray-600 mb-6 -mt-4">
          Para iniciar a atualização, confirme os dados de identificação do
          negócio e do responsável.
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
              <Input placeholder="Nome Completo" />
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
                      new Error("Envie o Certificado CCMEI (PDF ou Imagem)!")
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
          <Input placeholder="contato@email.com" />
        </Form.Item>
      </section>

      {/* --- INÍCIO DA REFATORAÇÃO --- */}
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações para Atualizar")}
        <p className="text-gray-600 mb-6 -mt-4">
          Preencha apenas os campos que deseja alterar. Os campos deixados em
          branco não serão modificados.
        </p>

        <Form.Item
          label="Nova Logo (Opcional)"
          help="Envie 1 nova imagem para substituir a logo atual."
        >
          <Upload
            customRequest={customUploadAction}
            fileList={logoFileList}
            onChange={handleLogoChange}
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg, image/webp"
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

        {/* CAMPO ADICIONADO DO REFACTOR (Briefing -> Diferencial) */}
        <Form.Item
          name="descricaoDiferencial"
          label="Novo Diferencial (Resumo)"
        >
          <TextArea
            rows={2}
            placeholder="Descreva brevemente qual é o atrativo do seu produto ou serviço."
          />
        </Form.Item>

        {/* CAMPO ADICIONADO DO REFACTOR */}
        <Form.Item name="descricao" label="Nova Descrição do Serviço/Produto">
          <TextArea
            rows={4}
            placeholder="Fale um pouco sobre o que você faz, quais produtos você vende ou tipo de serviço que realiza."
          />
        </Form.Item>

        {/* CAMPO ADICIONADO DO REFACTOR */}
        <Form.Item
          name="outrasAlteracoes"
          label="Outras Alterações (Opcional)"
          help="Se precisar alterar algo que não está no formulário (ex: Categoria, Endereço, Instagram, etc.), descreva aqui."
        >
          <TextArea
            rows={3}
            placeholder="Ex: Por favor, alterar o Instagram para @novo_mei e o endereço para Rua Nova, 123."
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
            {/* Mapeia todas as tags possíveis */}
            {[...new Set(Object.values(tagsPorCategoria).flat())].map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="portfolio" // Nome do campo no formulário
          label="Novas Fotos do Portfólio (até 4)"
          help="As imagens enviadas aqui irão substituir as atuais."
        >
          <Upload
            customRequest={customUploadAction}
            fileList={portfolioFileList}
            onChange={handlePortfolioChange}
            listType="picture"
            multiple
            maxCount={4}
            accept="image/png, image/jpeg, image/webp"
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
                      new Error("Você precisa confirmar esta caixa.")
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
      {/* --- FIM DA REFATORAÇÃO --- */}

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

  //PÁGINA DE FORMULÁRIO DE EXCLUSÃO
  const renderDeleteForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleDeleteSubmit}
      autoComplete="off"
    >
      {/* Campos Específicos do MEI (Mantidos) */}
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
              <Input placeholder="Nome Completo" />
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
                      new Error("Envie o Certificado CCMEI (PDF ou Imagem)!")
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
          <Input placeholder="contato@email.com" />
        </Form.Item>

        <Form.Item name="motivo" label="Motivo da exclusão (Opcional)">
          <TextArea
            rows={3}
            placeholder="Sua opinião é importante para nós. Se puder, nos diga por que está saindo."
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
                      new Error("Você precisa confirmar a exclusão!")
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
    // Estilo MeideSaquá
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