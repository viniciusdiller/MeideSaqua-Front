// app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  List,
  Modal,
  message,
  Descriptions,
  Spin,
  Empty,
  Typography,
  Image,
  Alert,
  Avatar,
  Table,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DatabaseOutlined, // Ícone para o novo botão
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api"; // Esta função é genérica, o que é ótimo
// import AdminEstabelecimentoModal from "@/components/AdminEstabelecimentoModal"; // Você precisará criar este componente
import { Estabelecimento, ImagemProduto } from "@/types/Interface-Estabelecimento"; // Usando o Tipo que definimos

const { Text, Title } = Typography;
const { Column } = Table;

// Enum de Status adaptado para Estabelecimento
enum StatusEstabelecimento {
  PENDENTE_APROVACAO = "pendente_aprovacao",
  PENDENTE_ATUALIZACAO = "pendente_atualizacao",
  PENDENTE_EXCLUSAO = "pendente_exclusao",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Objeto para os ícones dos cards (do seu novo arquivo)
const listIcons: { [key: string]: React.ReactNode } = {
  "Novos Cadastros": <UserAddOutlined style={{ color: "#52c41a" }} />,
  Atualizações: <EditOutlined style={{ color: "#1890ff" }} />,
  Exclusões: <DeleteOutlined style={{ color: "#f5222d" }} />,
};

// --- CONFIGURAÇÃO DE CAMPOS DO MEIDESAQUA (ORIGINAL) ---
// Este é o config original do seu dashboard de estabelecimentos, que é o correto a se usar.
const fieldConfig: { [key: string]: { label: string; order: number } } = {
  // Identificação Principal
  estabelecimentoId: { label: "ID", order: 1 },
  nomeFantasia: { label: "Nome Fantasia", order: 2 },
  cnpj: { label: "CNPJ", order: 3 },
  categoria: { label: "Categoria", order: 4 },
  status: { label: "Status Atual", order: 5 },
  cnae: { label: "CNAE", order: 6 },
  // Dados do Responsável
  nomeResponsavel: { label: "Nome do Responsável", order: 10 },
  nome_responsavel: { label: "Nome do Responsável", order: 10 },
  cpfResponsavel: { label: "CPF do Responsável", order: 11 },
  cpf_responsavel: { label: "CPF do Responsável", order: 11 },
  // Contato e Localização
  emailEstabelecimento: { label: "Email", order: 20 },
  contatoEstabelecimento: { label: "Contato", order: 21 },
  endereco: { label: "Endereço", order: 22 },
  areasAtuacao: { label: "Áreas de Atuação", order: 23 },
  // Descrições
  descricao: { label: "Descrição", order: 30 },
  descricaoDiferencial: { label: "Diferencial", order: 31 },
  // Mídia e Links
  website: { label: "Website", order: 40 },
  instagram: { label: "Instagram", order: 41 },
  logoUrl: { label: "Logo Atual", order: 42 },
  logo: { label: "Nova Logo", order: 42 },
  ccmeiUrl: { label: "CCMEI Atual", order: 43 },
  ccmei: { label: "Novo CCMEI", order: 43 },
  produtosImg: { label: "Portfólio Atual", order: 44 },
  produtos: { label: "Novo Portfólio", order: 44 },
  // Outros
  tagsInvisiveis: { label: "Tags", order: 50 },
  motivo: { label: "Motivo da Exclusão", order: 1000 },
  motivoExclusao: { label: "Motivo da Exclusão", order: 6 },
  createdAt: { label: "Data de Criação", order: 100 },
  updatedAt: { label: "Última Atualização", order: 101 },
};
// --- FIM DO CONFIG DE CAMPOS ---

interface PendingData {
  cadastros: Estabelecimento[];
  atualizacoes: Estabelecimento[];
  exclusoes: Estabelecimento[];
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PendingData>({
    cadastros: [],
    atualizacoes: [],
    exclusoes: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Estabelecimento | null>(
    null
  );
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Função de obter imagem (do seu arquivo original)
  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    return path.startsWith("http") || path.startsWith("https")
      ? path
      : `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
  };

  // --- RENDER VALUE DO MEIDESAQUA (ORIGINAL) ---
  // Esta é a função correta que sabe renderizar CCMEI, Produtos, etc.
  const renderValue = (
    key: string,
    value: any,
  ): React.ReactNode => {
     if (value === null || value === undefined || value === "") {
      return <Text type="secondary">Não informado</Text>;
    }

    if (
      (key === "ccmeiUrl" || key === "ccmei") &&
      typeof value === "string" &&
      value
    ) {
      const fileUrl = getFullImageUrl(value);
      const isPdf = value.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold underline"
          >
            Ver Certificado (PDF)
          </a>
        );
      }
      return (
        <Image src={fileUrl} alt={`CCMEI`} width={150} />
      );
    }

    if ((key === "produtosImg" || key === "produtos") && Array.isArray(value)) {
      const imagesUrls = value
        .map((item) => (typeof item === "string" ? item : item.url))
        .map(getFullImageUrl)
        .filter(Boolean);

      if (imagesUrls.length > 0) {
        return (
          <Image.PreviewGroup>
            <Row gutter={[8, 8]}>
              {imagesUrls.map((imageUrl, index) => (
                <Col key={index}>
                  <Image src={imageUrl} alt={`Produto ${index + 1}`} width={80} />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        );
      }
      return <Text type="secondary">Nenhuma imagem.</Text>;
    }

    if (
      (key === "logoUrl" || key === "logo") &&
      typeof value === "string" &&
      value
    ) {
      return (
        <Image
          src={getFullImageUrl(value)}
          alt={`Logo`}
          width={150}
        />
      );
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  };
  // --- FIM DO RENDER VALUE ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      // Esta função busca todos os tipos de pendências
      const pendingData = await getPendingAdminRequests(token);
      setData(pendingData);
    } catch (error: any)
{
      message.error(error.message || "Falha ao buscar dados.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLE ACTION DO MEIDESAQUA (ORIGINAL) ---
  // Esta é a função com o endpoint correto para estabelecimentos
  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.estabelecimentoId}`, // Endpoint correto
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      message.success(`Ação executada com sucesso!`);

      setData((prevData) => {
        const newData = { ...prevData };
        (Object.keys(newData) as Array<keyof PendingData>).forEach((key) => {
          newData[key] = newData[key].filter(
            (item) => item.estabelecimentoId !== selectedItem.estabelecimentoId // Chave correta
          );
        });
        return newData;
      });

      setModalVisible(false);
      setSelectedItem(null);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };
  // --- FIM DO HANDLE ACTION ---

  const showModal = (item: Estabelecimento) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedItem) return;
    setIsEditModalVisible(true);
  };

  // --- HANDLE EDIT AND APPROVE (ADAPTADO) ---
  // Lógica do seu novo arquivo, mas adaptada para 'estabelecimentoId'
  const handleEditAndApproveSubmit = async (values: any) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      setIsActionLoading(false);
      return;
    }

    try {
      // Este endpoint é hipotético, ajuste se necessário
      const response = await fetch(
        `${API_URL}/api/admin/edit-and-approve/${selectedItem.estabelecimentoId}`, // Chave correta
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // 'values' vem do modal
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setIsEditModalVisible(false);
      setModalVisible(false);
      setSelectedItem(null);
      fetchData(); // Recarrega os dados
    } catch (error: any) {
      setIsActionLoading(false);
      // Lança o erro para o modal (AdminEstabelecimentoModal) tratar
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };
  // --- FIM DO HANDLE EDIT AND APPROVE ---

  // --- RENDER DIFF TABLE (ADAPTADO) ---
  // Lógica do seu novo arquivo, mas adaptada para os campos de Estabelecimento
  const renderDiffTable = (
    status: StatusEstabelecimento,
    alertType: "info" | "error",
    title: string,
    keysToFilter: string[] = []
  ) => {
    if (
      !selectedItem ||
      selectedItem.status !== status ||
      !selectedItem.dados_atualizacao
    ) {
      return null;
    }

    // Mapa de chaves ADAPTADO para Estabelecimento
    const keyMap: { [newKey: string]: { oldKey: string; labelKey: string } } = {
      logo: { oldKey: "logoUrl", labelKey: "logo" },
      ccmei: { oldKey: "ccmeiUrl", labelKey: "ccmei" },
      produtos: { oldKey: "produtosImg", labelKey: "produtos" },
      nome_responsavel: { oldKey: "nomeResponsavel", labelKey: "nomeResponsavel" },
      cpf_responsavel: { oldKey: "cpfResponsavel", labelKey: "cpfResponsavel" },
    };

    const diffData = Object.entries(selectedItem.dados_atualizacao)
      .filter(([key]) => !keysToFilter.includes(key))
      .map(([key, newValue]) => {
        const mapping = keyMap[key];
        const oldKey = mapping ? mapping.oldKey : key;
        const labelKey = mapping ? mapping.labelKey : key;

        // Usa o fieldConfig de Estabelecimento
        const fieldLabel = fieldConfig[labelKey]?.label ?? `Novo ${key}`;
        const oldValue = selectedItem[oldKey];

        let finalLabel = fieldLabel;
        if (labelKey === "produtos") finalLabel = "Portfólio";
        if (labelKey === "ccmei") finalLabel = "CCMEI";
        if (labelKey === "logo") finalLabel = "Logo";
        if (key === "motivo") finalLabel = "Motivo da Exclusão";

        return {
          key: oldKey,
          newKey: key,
          field: finalLabel,
          oldValue: oldValue,
          newValue: newValue,
        };
      })
      .sort(
        (a, b) =>
          (fieldConfig[a.newKey]?.order ?? 999) -
          (fieldConfig[b.newKey]?.order ?? 999)
      );
    
    const titleColor = alertType === "info" ? "#0050b3" : "#d4380d";

    return (
      <Alert
        type={alertType}
        showIcon
        className="mt-6"
        style={{ overflow: "hidden" }}
        message={
          <Title level={4} style={{ margin: 0, color: titleColor }}>
            {title}
          </Title>
        }
        description={
          <Table
            dataSource={diffData}
            pagination={false}
            size="middle"
            bordered
            className="mt-4"
            scroll={{ x: true }}
          >
            <Column title="Campo" dataIndex="field" key="field" width={150} />
            <Column
              title="Valor Antigo"
              dataIndex="oldValue"
              key="oldValue"
              width={400}
              // Usa o renderValue de Estabelecimento
              render={(value, record: any) => renderValue(record.key, value)}
            />
            <Column
              title="Valor Novo"
              dataIndex="newValue"
              key="newValue"
              width={450}
              // Usa o renderValue de Estabelecimento
              render={(value, record: any) => renderValue(record.newKey, value)}
            />
          </Table>
        }
      />
    );
  };
  // --- FIM DO RENDER DIFF TABLE ---

  // --- RENDER LIST (ADAPTADO) ---
  // Lógica do seu novo arquivo, mas com os dados de Estabelecimento
  const renderList = (title: string, listData: Estabelecimento[]) => (
    <Col xs={24} md={12} lg={8}>
      <Card
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {listIcons[title]}
            {title} ({listData.length})
          </span>
        }
      >
        {listData.length > 0 ? (
          <List
            dataSource={listData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => showModal(item)}>
                    Detalhes
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={getFullImageUrl(item.logoUrl || "")}
                      icon={listIcons[title]} // Icone de fallback
                    />
                  }
                  title={item.nomeFantasia} // Campo de Estabelecimento
                  description={`CNPJ: ${item.cnpj}`} // Campo de Estabelecimento
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Nenhuma solicitação" />
        )}
      </Card>
    </Col>
  );
  // --- FIM DO RENDER LIST ---

  return (
    <div className="p-8">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="m-0">
            Painel de Administração
          </Title>
          {/* --- BOTÃO "GERENCIAR ATIVOS" (ADAPTADO) --- */}
          <Link href="/admin/estabelecimentos-ativos" passHref>
            <Button type="primary" icon={<DatabaseOutlined />} size="large">
              Gerenciar Estabelecimentos Ativos
            </Button>
          </Link>
          {/* --- FIM DO BOTÃO --- */}
        </div>

        <Row gutter={[16, 16]}>
          {renderList("Novos Cadastros", data.cadastros)}
          {renderList("Atualizações", data.atualizacoes)}
          {renderList("Exclusões", data.exclusoes)}
        </Row>
      </Spin>

      {selectedItem && (
        <Modal
          title={`Detalhes de ${selectedItem.nomeFantasia}`} // Título adaptado
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={1000}
          // --- FOOTER DO SEU NOVO ARQUIVO (ADAPTADO) ---
          footer={[
            <Button
              key="reject"
              onClick={() => handleAction("reject")}
              icon={<CloseOutlined />}
              danger
              loading={isActionLoading}
            >
              Recusar
            </Button>,
            selectedItem.status !== StatusEstabelecimento.PENDENTE_EXCLUSAO ? (
              <Button
                key="approve_direct"
                onClick={() => handleAction("approve")}
                icon={<CheckOutlined />}
                loading={isActionLoading}
              >
                Aprovar Direto
              </Button>
            ) : (
              <Button
                key="approve_delete"
                type="primary"
                danger
                onClick={() => handleAction("approve")}
                icon={<CheckOutlined />}
                loading={isActionLoading}
              >
                Confirmar Exclusão
              </Button>
            ),
            selectedItem.status !== StatusEstabelecimento.PENDENTE_EXCLUSAO && (
              <Button
                key="edit_and_approve"
                type="primary"
                onClick={handleOpenEditModal} // Abre o modal de edição
                icon={<EditOutlined />}
                loading={isActionLoading}
              >
                Editar e Aprovar
              </Button>
            ),
          ]}
          // --- FIM DO FOOTER ---
        >
          {/* --- DESCRIPTIONS DO MEIDESAQUA (ORIGINAL) --- */}
          {/* Este é o <Descriptions> do seu arquivo original, que funciona com o fieldConfig */}
          <Title level={4}>Dados Atuais</Title>
          <Descriptions bordered column={1} size="small">
            {Object.entries(selectedItem)
              .filter(
                ([key, value]) =>
                  key !== "dados_atualizacao" &&
                  value !== null &&
                  value !== "" &&
                  value !== undefined
              )
              .sort(
                ([keyA], [keyB]) =>
                  (fieldConfig[keyA]?.order ?? 999) -
                  (fieldConfig[keyB]?.order ?? 999)
              )
              .map(([key, value]) => (
                 fieldConfig[key] && ( // Garante que só renderiza campos do config
                  <Descriptions.Item
                    key={key}
                    label={fieldConfig[key]?.label ?? key}
                  >
                    {renderValue(key, value)}
                  </Descriptions.Item>
                 )
              ))}
          </Descriptions>
          {/* --- FIM DO DESCRIPTIONS --- */}

          {/* --- RENDER DIFF TABLES (DO SEU NOVO ARQUIVO) --- */}
          {renderDiffTable(
            StatusEstabelecimento.PENDENTE_EXCLUSAO,
            "error",
            "Solicitação de Exclusão",
            ["estabelecimentoId", "confirmacao"]
          )}

          {renderDiffTable(
            StatusEstabelecimento.PENDENTE_ATUALIZACAO,
            "info",
            "Dados para Atualizar",
            ["motivoExclusao"]
          )}
          {/* --- FIM DO RENDER DIFF TABLES --- */}
        </Modal>
      )}

      {/* --- NOVO MODAL DE EDIÇÃO (ADAPTADO) --- */}
      {/*
      <AdminEstabelecimentoModal
        estabelecimento={selectedItem}
        visible={isEditModalVisible}
        onClose={(shouldRefresh) => {
          setIsEditModalVisible(false);
          if (shouldRefresh) {
            setModalVisible(false);
            setSelectedItem(null);
            fetchData();
          }
        }}
        mode="edit-and-approve"
        onEditAndApprove={handleEditAndApproveSubmit}
      />
      */}
    </div>
  );
};

export default AdminDashboard;