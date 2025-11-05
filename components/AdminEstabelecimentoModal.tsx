// components/AdminEstabelecimentoModal.tsx
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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { adminUpdateEstablishment } from "@/lib/api";
import { Estabelecimento } from "@/types/Interface-Estabelecimento";

// Importa as constantes do arquivo de cadastro
import {
  categorias,
  tagsPorCategoria,
  areasAtuacao,
} from "@/app/cadastro-mei/page";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Helper para criar uma lista única de todas as tags
const allTags = [
  ...new Set(Object.values(tagsPorCategoria).flat()),
].sort((a, b) => a.localeCompare(b));

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

  // Estados para os arquivos
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [ccmeiFileList, setCcmeiFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (estabelecimento) {
      let dataToEdit: any = { ...estabelecimento };

      if (
        estabelecimento.status === "pendente_atualizacao" &&
        estabelecimento.dados_atualizacao
      ) {
        dataToEdit = { ...estabelecimento, ...estabelecimento.dados_atualizacao };
        setOutrasAlteracoes(
          estabelecimento.dados_atualizacao.outrasAlteracoes || null
        );
        delete dataToEdit.outrasAlteracoes;
      } else {
        setOutrasAlteracoes(null);
      }
      
      // --- CORREÇÃO DO BUG ---
      // Mapeia os campos de camelCase (do objeto base) para snake_case (do formulário)
      // Isso corrige o bug dos campos vazios no modo "edit-only".
      if (!dataToEdit.nome_responsavel && dataToEdit.nomeResponsavel) {
        dataToEdit.nome_responsavel = dataToEdit.nomeResponsavel;
      }
      if (!dataToEdit.cpf_responsavel && dataToEdit.cpfResponsavel) {
        dataToEdit.cpf_responsavel = dataToEdit.cpfResponsavel;
      }
      // --- FIM DA CORREÇÃO ---

      if (typeof dataToEdit.tagsInvisiveis === "string") {
        dataToEdit.tagsInvisiveis = dataToEdit.tagsInvisiveis
          .split(",")
          .map((s: string) => s.trim());
      }
      if (typeof dataToEdit.areasAtuacao === "string") {
        dataToEdit.areasAtuacao = dataToEdit.areasAtuacao
          .split(",")
          .map((s: string) => s.trim());
      }

      editForm.setFieldsValue(dataToEdit);
    } else {
      editForm.resetFields();
      setOutrasAlteracoes(null);
      setLogoFileList([]);
      setPortfolioFileList([]);
      setCcmeiFileList([]);
    }
  }, [estabelecimento, visible, editForm]);

  const handleSubmit = async (values: any) => {
    if (!estabelecimento) return;

    setIsEditLoading(true);

    if (Array.isArray(values.tagsInvisiveis)) {
      values.tagsInvisiveis = values.tagsInvisiveis.join(", ");
    }
    if (Array.isArray(values.areasAtuacao)) {
      values.areasAtuacao = values.areasAtuacao.join(", ");
    }

    const formData = new FormData();
    for (const key in values) {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    }

    if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
      formData.append("logo", logoFileList[0].originFileObj);
    }
    if (portfolioFileList.length > 0) {
      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("produtos", file.originFileObj);
        }
      });
    }
    if (ccmeiFileList.length > 0 && ccmeiFileList[0].originFileObj) {
      formData.append("ccmei", ccmeiFileList[0].originFileObj);
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

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);
  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);
  const handleCCMEIChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setCcmeiFileList(fileList);

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
                label="Categoria"
                rules={[{ required: true }]}
              >
                <Select placeholder="Selecione a categoria">
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
              {/* Este nome (snake_case) é o que o formulário usa */}
              <Form.Item
                name="nome_responsavel"
                label="Nome do Responsável"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* Este nome (snake_case) é o que o formulário usa */}
              <Form.Item
                name="cpf_responsavel"
                label="CPF do Responsável"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cnpj"
                label="CNPJ"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cnae"
                label="CNAE"
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
          >
            <TextArea rows={5} />
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
            <Select mode="multiple" placeholder="Selecione as tags">
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Title level={5} className="mt-4">
            Arquivos (Substituir)
          </Title>
          <Alert
            message="Aviso sobre Arquivos"
            description="Para alterar a Logo, Portfólio ou CCMEI, basta carregar os novos arquivos. Os arquivos antigos serão substituídos. Deixe em branco para manter os atuais."
            type="warning"
            showIcon
            className="mb-4"
          />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Logo">
                <Upload
                  customRequest={({ onSuccess }) =>
                    setTimeout(() => onSuccess && onSuccess("ok"), 0)
                  }
                  fileList={logoFileList}
                  onChange={handleLogoChange}
                  listType="picture"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Carregar Nova Logo</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Portfólio (até 4)">
                <Upload
                  customRequest={({ onSuccess }) =>
                    setTimeout(() => onSuccess && onSuccess("ok"), 0)
                  }
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
            <Col span={8}>
              <Form.Item label="CCMEI">
                <Upload
                  customRequest={({ onSuccess }) =>
                    setTimeout(() => onSuccess && onSuccess("ok"), 0)
                  }
                  fileList={ccmeiFileList}
                  onChange={handleCCMEIChange}
                  listType="picture"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Carregar Novo CCMEI</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </Form>
    </Modal>
  );
};

export default AdminEstabelecimentoModal;