"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Spin,
  Alert,
  message,
  Typography,
  Image as AntdImage,
  Tag,
  Popconfirm,
} from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  adminUpdateEstablishment,
  adminEditAndApproveEstablishment,
} from "@/lib/api";
import {
  Estabelecimento,
  ImagemProduto,
} from "@/types/Interface-Estabelecimento"; // Isto agora está correto
import {
  categorias,
  areasAtuacao,
  tagsPorCategoria,
} from "@/app/cadastro-mei/page";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "@/app/cadastro-mei/quill-styles.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Spin
      size="large"
      style={{ display: "block", margin: "20px auto", minHeight: "150px" }}
    />
  ),
});

const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AdminEstabelecimentoModalProps {
  estabelecimento: Estabelecimento | null;
  visible: boolean;
  onClose: (shouldRefresh: boolean) => void;
  mode: "edit-and-approve" | "edit-only";
  onEditAndApprove: (formData: FormData) => Promise<void>;
}

const AdminEstabelecimentoModal: React.FC<AdminEstabelecimentoModalProps> = ({
  estabelecimento,
  visible,
  onClose,
  mode,
  onEditAndApprove,
}) => {
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [outrasAlteracoes, setOutrasAlteracoes] = useState<string | null>(null);

  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [currentPortfolio, setCurrentPortfolio] = useState<ImagemProduto[]>([]);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string[]>([]);
  const [logoToDelete, setLogoToDelete] = useState<boolean>(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  // A função que corrige o bug da imagem quebrada
  const getFullImageUrl = (
    path: string | null | undefined
  ): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("http") || path.startsWith("blob:")) {
      return path;
    }
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.substring(1)
      : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const uniqueTags = [
      ...new Set(Object.values(tagsPorCategoria).flat()),
    ].sort();
    setAllTags(uniqueTags);

    if (estabelecimento) {
      let dataToEdit: any = { ...estabelecimento };
      let finalLogoUrl = estabelecimento.logoUrl || null;

      // --- CORREÇÃO AQUI ---
      // Usar 'produtosImg' (do backend/interface) em vez de 'imagensProduto'
      let finalPortfolioImgs = estabelecimento.produtosImg || [];
      // --- FIM DA CORREÇÃO ---

      if (
        estabelecimento.status === "pendente_atualizacao" &&
        estabelecimento.dados_atualizacao
      ) {
        dataToEdit = {
          ...estabelecimento,
          ...estabelecimento.dados_atualizacao,
        };
        setOutrasAlteracoes(
          estabelecimento.dados_atualizacao.outrasAlteracoes || null
        );
        finalLogoUrl = estabelecimento.dados_atualizacao.logo || finalLogoUrl;
        if (estabelecimento.dados_atualizacao.produtos) {
          finalPortfolioImgs = estabelecimento.dados_atualizacao.produtos.map(
            (url: string) => ({ url: url })
          );
        }
        delete dataToEdit.outrasAlteracoes;
      } else {
        setOutrasAlteracoes(null);
      }

      // Lógica (que já tínhamos) para filtrar o logo do portfólio
      const normalize = (path: string | null | undefined): string => {
        if (!path) return "";
        return path
          .replace(API_URL || "", "")
          .replace(/\\/g, "/")
          .replace(/^\/+|\/+$/g, "");
      };

      const normalizedLogoPath = normalize(finalLogoUrl);

      const filteredPortfolio = finalPortfolioImgs.filter((img) => {
        if (!img || !img.url) return false;
        if (normalizedLogoPath === "") return true;
        return normalize(img.url) !== normalizedLogoPath;
      });

      setCurrentLogo(finalLogoUrl);
      setCurrentPortfolio(filteredPortfolio); // Agora 'filteredPortfolio' deve ter as imagens corretas

      setPortfolioToDelete([]);
      setLogoToDelete(false);

      if (typeof dataToEdit.areasAtuacao === "string") {
        dataToEdit.areasAtuacao = dataToEdit.areasAtuacao
          .split(",")
          .map((s: string) => s.trim());
      }
      if (typeof dataToEdit.tagsInvisiveis === "string") {
        dataToEdit.tagsInvisiveis = dataToEdit.tagsInvisiveis
          .split(",")
          .map((s: string) => s.trim());
      }

      editForm.setFieldsValue(dataToEdit);
    } else {
      editForm.resetFields();
      setOutrasAlteracoes(null);
      setCurrentLogo(null);
      setCurrentPortfolio([]);
      setPortfolioToDelete([]);
      setLogoToDelete(false);
    }
  }, [estabelecimento, visible, editForm]);

  const handleSubmit = async (values: any) => {
    if (!estabelecimento) return;

    setIsEditLoading(true);

    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (value) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (logoToDelete) {
      formData.append("logoUrl", "DELETE");
    }

    if (portfolioToDelete.length > 0) {
      formData.append("urlsParaExcluir", JSON.stringify(portfolioToDelete));
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        message.error("Autenticação expirada.");
        setIsEditLoading(false);
        return;
      }

      if (mode === "edit-and-approve") {
        await onEditAndApprove(formData);
        message.success("Estabelecimento editado e aprovado!");
      } else {
        await adminUpdateEstablishment(
          estabelecimento.estabelecimentoId,
          formData,
          token
        );
        message.success("Estabelecimento atualizado com sucesso!");
      }

      onClose(true);
    } catch (error: any) {
      message.error(error.message || "Falha ao salvar.");
    } finally {
      setIsEditLoading(false);
    }
  };

  return (
    <Modal
      title={
        mode === "edit-and-approve"
          ? "Editar e Aprovar Estabelecimento"
          : "Editar Estabelecimento"
      }
      open={visible}
      onCancel={() => onClose(false)}
      width={900}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isEditLoading}
          onClick={() => editForm.submit()}
        >
          {mode === "edit-and-approve" ? "Salvar e Aprovar" : "Salvar Edições"}
        </Button>,
      ]}
    >
      <Form
        form={editForm}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Spin spinning={isEditLoading}>
          {outrasAlteracoes && (
            <Alert
              message="Solicitação de 'Outras Alterações' do Usuário"
              description={
                <Typography.Paragraph pre-wrap>
                  {outrasAlteracoes}
                </Typography.Paragraph>
              }
              type="info"
              showIcon
              className="mb-4"
            />
          )}

          <Title level={5} className="mt-4">
            Informações Principais
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nomeFantasia"
                label="Nome Fantasia"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoria"
                label="Categoria Principal"
                rules={[{ required: true }]}
              >
                <Select placeholder="Selecione a categoria principal">
                  {categorias.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cnae" label="CNAE" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nomeResponsavel"
                label="Nome do Responsável"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cpfResponsavel"
                label="CPF do Responsável"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="mt-4">
            Contato e Links
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emailEstabelecimento"
                label="Email de Contato"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contatoEstabelecimento"
                label="Telefone / WhatsApp"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="website"
                label="Website"
                rules={[{ type: "url" }]}
              >
                <Input placeholder="http://..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="instagram"
                label="Instagram"
                rules={[{ type: "url" }]}
              >
                <Input placeholder="http://instagram.com/..." />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="endereco" label="Endereço">
            <Input />
          </Form.Item>

          <Title level={5} className="mt-4">
            Detalhes
          </Title>
          <Form.Item
            name="descricaoDiferencial"
            label="Diferencial (Descrição Curta)"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="descricao"
            label="Descrição Completa"
            rules={[{ required: true }]}
            className="quill-editor-container"
          >
            <ReactQuill
              theme="snow"
              modules={quillModules}
              placeholder="Descreva o projeto em detalhes, você pode usar negrito, itálico..."
              style={{ minHeight: "10px" }}
            />
          </Form.Item>

          <Form.Item name="areasAtuacao" label="Áreas de Atuação">
            <Select mode="multiple" placeholder="Selecione as áreas">
              {areasAtuacao.map((area) => (
                <Option key={area} value={area}>
                  {area}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="tagsInvisiveis" label="Tags de Busca">
            <Select mode="multiple" placeholder="Selecione as tags de busca">
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Title level={5} className="mt-4">
            Gerenciamento de Imagens
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5} style={{ fontSize: "16px" }}>
                Logo
              </Title>
              <div style={{ position: "relative", width: "fit-content" }}>
                <AntdImage
                  src={getFullImageUrl(currentLogo)}
                  alt="Logo do Estabelecimento"
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: "cover",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    opacity: logoToDelete ? 0.5 : 1,
                  }}
                  fallback="/logo_mei_redonda.png" //
                />
                {currentLogo && (
                  <Popconfirm
                    title="Remover esta logo?"
                    okText="Remover"
                    cancelText="Cancelar"
                    okType="danger"
                    placement="topRight"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={() => {
                      setLogoToDelete(true);
                      setCurrentLogo(null);
                      message.info("Logo marcada para remoção.");
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<CloseOutlined />}
                      style={{ position: "absolute", top: 5, right: 5 }}
                      size="small"
                      title="Remover Logo"
                    />
                  </Popconfirm>
                )}
              </div>
              {logoToDelete && (
                <Tag color="red" style={{ marginTop: 10, width: "100%" }}>
                  Logo será removida ao salvar.
                </Tag>
              )}
            </Col>
            <Col span={12}>
              <Title level={5} style={{ fontSize: "16px" }}>
                Imagens do Portfólio (Produtos)
              </Title>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {currentPortfolio.length > 0 ? (
                  currentPortfolio.map((img: ImagemProduto) => (
                    <div
                      key={img.url}
                      style={{ position: "relative", width: "fit-content" }}
                    >
                      <AntdImage
                        src={getFullImageUrl(img.url)}
                        alt="Imagem do Portfólio"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          border: "1px solid #d9d9d9",
                          borderRadius: "8px",
                        }}
                        fallback="/placeholder-logo.png"
                      />
                      <Popconfirm
                        title="Tem certeza que quer remover esta imagem?"
                        okText="Remover"
                        cancelText="Cancelar"
                        okType="danger"
                        placement="topRight"
                        icon={
                          <QuestionCircleOutlined style={{ color: "red" }} />
                        }
                        onConfirm={() => {
                          setPortfolioToDelete((prev) => [...prev, img.url]);
                          setCurrentPortfolio((prev) =>
                            prev.filter((i) => i.url !== img.url)
                          );
                          message.info("Imagem marcada para remoção.");
                        }}
                      >
                        <Button
                          type="primary"
                          danger
                          icon={<CloseOutlined />}
                          style={{ position: "absolute", top: 5, right: 5 }}
                          size="small"
                          title="Remover Imagem"
                        />
                      </Popconfirm>
                    </div>
                  ))
                ) : (
                  <p>Nenhuma imagem no portfólio.</p>
                )}
                {portfolioToDelete.length > 0 && (
                  <Tag color="red" style={{ marginTop: 10, width: "100%" }}>
                    {portfolioToDelete.length} imagem(ns) serão removidas.
                  </Tag>
                )}
              </div>
            </Col>
          </Row>
        </Spin>
      </Form>
    </Modal>
  );
};

export default AdminEstabelecimentoModal;
