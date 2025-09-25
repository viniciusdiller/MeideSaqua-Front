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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

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

// --- API E LISTAS (sem alterações) ---
const API_URL = "http://localhost:3306/api";
const api = {
  cadastrarEstabelecimento: async (data: any) => {
    const response = await fetch(`${API_URL}/estabelecimentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao cadastrar.");
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
const { Option } = Select;
const { TextArea } = Input;

const CadastroMEIPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);
  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);

  // Handlers específicos para cada campo com máscara
  const handleCnaeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ cnae: maskCNAE(e.target.value) });
  };
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ cpf: maskCPF(e.target.value) });
  };
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ cnpj: maskCNPJ(e.target.value) });
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ contatoEstabelecimento: maskPhone(e.target.value) });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const logoData = logoFileList.map((file) => file.response || file);
      const portfolioData = portfolioFileList.map(
        (file) => file.response || file
      );

      const payload = {
        ...values,
        cnae: values.cnae.replace(/\D/g, ""),
        cpf: values.cpf ? values.cpf.replace(/\D/g, "") : "",
        cnpj: values.cnpj ? values.cnpj.replace(/\D/g, "") : "",
        contatoEstabelecimento: values.contatoEstabelecimento.replace(
          /\D/g,
          ""
        ),
        locais: values.locais ? values.locais.join(", ") : "",
        logoBase64: JSON.stringify(logoData),
        produtosImgBase64: JSON.stringify(portfolioData),
        ativo: true,
      };

      await api.cadastrarEstabelecimento(payload);
      message.success(
        "Cadastro realizado com sucesso! Em breve seu negócio estará na plataforma."
      );
      form.resetFields();
      setLogoFileList([]);
      setPortfolioFileList([]);
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const customUploadAction = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setTimeout(() => {
      try {
        const mockUrl = `https://workflow-content.colab.re/mock_upload_${Date.now()}_${
          file.name
        }`;
        onSuccess({
          uid: file.uid,
          name: file.name,
          url: mockUrl,
          status: "done",
        });
      } catch (err) {
        onError(new Error("Erro no upload simulado"));
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <h1 className="text-4xl font-extrabold mb-10 inline-block pb-2 bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-no-repeat [background-position:0_100%] [background-size:100%_4px]">
          <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
            CADASTRO DE MEI
          </span>
        </h1>
        <p className="text-gray-700 leading-relaxed text-lg mt-4 mb-8">
          Faça parte da nossa vitrine de talentos locais! Preencha o formulário
          abaixo para divulgar o seu trabalho para toda a comunidade de
          Saquarema.
        </p>

        <Spin spinning={loading} tip="A enviar dados...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <section className="mb-8 border-t pt-4">
              <h2
                className="relative text-2xl font-semibold text-gray-800 mb-6 pl-4 
           before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 
           before:bg-gradient-to-t from-[#017DB9] to-[#22c362]"
              >
                Informações do Negócio e Responsável
              </h2>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="nomeFantasia"
                    label="Nome Fantasia"
                    rules={[
                      {
                        required: true,
                        message: "Insira o nome do seu negócio!",
                      },
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
                      onChange={handleCnaeChange}
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
                      onChange={handleCpfChange}
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
                      onChange={handleCnpjChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="categoria"
                label="Categoria"
                rules={[
                  { required: true, message: "Selecione uma categoria!" },
                ]}
              >
                <Select placeholder="Selecione a categoria principal">
                  {categorias.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </section>

            <section className="mb-8 border-t pt-4">
              <h2
                className="relative text-2xl font-semibold text-gray-800 mb-6 pl-4 
           before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 
           before:bg-gradient-to-t from-[#017DB9] to-[#22c362]"
              >
                Contato e Localização
              </h2>
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
                      onChange={handlePhoneChange}
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
                name="locais"
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
              <h2
                className="relative text-2xl font-semibold text-gray-800 mb-6 pl-4 
           before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 
           before:bg-gradient-to-t from-[#017DB9] to-[#22c362]"
              >
                Detalhes e Mídia
              </h2>
              <Form.Item
                name="descricao"
                label="Descrição do seu Serviço/Produto"
              >
                <TextArea
                  rows={4}
                  placeholder="Fale um pouco sobre o que você faz, seus principais produtos ou serviços."
                />
              </Form.Item>
              <Form.Item
                name="descricaoDiferencial"
                label="Qual o seu diferencial?"
              >
                <TextArea
                  rows={2}
                  placeholder="Ex: Atendimento a domicílio, produtos artesanais, etc."
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
                  <Form.Item
                    label="Sua Logo"
                    help="Envie 1 imagem para o perfil."
                  >
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
                  <Form.Item label="Seu Portfólio" help="Envie até 5 imagens.">
                    <Upload
                      customRequest={customUploadAction}
                      fileList={portfolioFileList}
                      onChange={handlePortfolioChange}
                      listType="picture"
                      multiple
                      maxCount={5}
                    >
                      <Button icon={<UploadOutlined />}>
                        Carregar Portfólio
                      </Button>
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
        </Spin>
      </div>
    </div>
  );
};

export default CadastroMEIPage;
