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

// --- FUNÇÕES DE MÁSCARA (sem alterações) ---
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

  atualizarEstabelecimento: async (data: any) => {
    const response = await fetch(
      `${API_URL}/api/estabelecimentos/solicitar-atualizacao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao solicitar a atualização.");
    }
    return response.json();
  },

  excluirEstabelecimento: async (data: any) => {
    const response = await fetch(
      `${API_URL}/api/estabelecimentos/solicitar-exclusao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cnpj: data.cnpj }), // A rota espera um objeto com a chave cnpj
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao solicitar a exclusão.");
    }
    return response.json();
  },
};

const areasAtuacao = [
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

const categorias = [
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

const tagsPorCategoria: { [key: string]: string[] } = {
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

const { Option } = Select;
const { TextArea } = Input;

type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";

const CadastroMEIPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState({
    title: "",
    subTitle: "",
  });

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);
  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);

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
    setFlowStep("initial");
  };

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Adiciona todos os campos de texto ao formData
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
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

      // Adiciona a LOGO (se existir)
      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append("logo", logoFileList[0].originFileObj);
      }

      // Adiciona as imagens do PORTFÓLIO (se existirem)
      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("produtos", file.originFileObj);
        }
      });

      // Envia o FormData para a API
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

  const handleUpdateSubmit = async (values: any) => {
    setLoading(true);
    try {
      await api.atualizarEstabelecimento(values);
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
      await api.excluirEstabelecimento(values);
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

  const customUploadAction = async (options: any) => {
    const { onSuccess, onError, file } = options;
    // Simula upload para o Ant Design
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

  //PÁGINA INICIAL
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

  //PÁGINA DE FORMULÁRIO DE CADASTRO
  const renderRegisterForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleRegisterSubmit}
      autoComplete="off"
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações do Negócio e Responsável")}
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
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="cpf"
              label="CPF"
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
                name="cpf"
                onChange={(e) => handleMaskChange(e, maskCPF)}
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
        <Form.Item
          name="categoria"
          label="Categoria"
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
        <Row gutter={24}></Row>
      </section>
      <section className="mb-8 border-t pt-4">
        {commonTitle("Contato e Localização")}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="contatoEstabelecimento"
              label="Telefone / WhatsApp"
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
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="emailEstabelecimento"
              label="E-mail de Contato"
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
          </Col>
        </Row>
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
            placeholder="Fale um pouco sobre o que você faz..."
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
          <TextArea rows={2} placeholder="Ex: Atendimento a domicílio, etc." />
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
              >
                <Button icon={<UploadOutlined />}>Carregar Logo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Seu Portfólio" help="Envie até 4 imagens.">
              <Upload
                customRequest={customUploadAction}
                fileList={portfolioFileList}
                onChange={handlePortfolioChange}
                listType="picture"
                multiple
                maxCount={4}
              >
                <Button icon={<UploadOutlined />}>Carregar Portfólio</Button>
              </Upload>
            </Form.Item>
          </Col>
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

  //PÁGINA DE FORMULÁRIO DE ATUALIZAÇÃO
  const renderUpdateForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdateSubmit}
      autoComplete="off"
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Identificação do Negócio")}
        <Form.Item
          name="cnpj"
          label="CNPJ do Negócio a ser atualizado"
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
      </section>
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações para Atualizar")}
        <p className="text-gray-600 mb-6 -mt-4">
          Preencha apenas os campos que deseja alterar. Os campos deixados em
          branco não serão modificados.
        </p>
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
          <Col xs={24} md={12}>
            <Form.Item
              name="emailEstabelecimento"
              label="Novo E-mail de Contato"
              rules={[
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido!",
                },
              ]}
            >
              <Input placeholder="contato@email.com" />
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
        <Form.Item name="descricao" label="Nova Descrição do Serviço/Produto">
          <TextArea rows={4} />
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
            mode="multiple" // Alterado para 'multiple'
            allowClear
            placeholder="Selecione as tags"
            maxTagCount={5}
          >
            {/* Como a categoria anterior não está em estado, listamos todas as tags populares */}
            {Object.values(tagsPorCategoria)
              .flat()
              .map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="portfolio"
          label="Novas Fotos do Portfólio (até 5)"
          help="As imagens enviadas aqui irão substituir as atuais."
        >
          <Upload
            customRequest={customUploadAction}
            fileList={portfolioFileList}
            onChange={handlePortfolioChange}
            listType="picture"
            multiple
            maxCount={5}
          >
            <Button icon={<UploadOutlined />}>Carregar Novas Imagens</Button>
          </Upload>
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

  //PÁGINA DE FORMULÁRIO DE EXCLUSÃO
  const renderDeleteForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleDeleteSubmit}
      autoComplete="off"
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Exclusão de Cadastro MEI")}
        <p className="text-red-700 bg-red-50 p-4 rounded-md mb-6 -mt-2">
          <b>Atenção:</b> Esta ação é permanente e removerá seu negócio da nossa
          plataforma. Para voltar, será necessário um novo cadastro.
        </p>
        <Form.Item
          name="cnpj"
          label="Confirme o CNPJ do negócio a ser excluído"
          rules={[
            { required: true, message: "O CNPJ é obrigatório!" },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <Spin spinning={loading} tip="A processar...">
          {/* Botão de Voltar, aparece em todas as etapas exceto a inicial e a de sucesso */}
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
