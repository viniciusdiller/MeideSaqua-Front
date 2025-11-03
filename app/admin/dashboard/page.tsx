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
  Grid, // IMPORTADO (NOVA FEATURE)
  Pagination, // IMPORTADO (NOVA FEATURE)
  Input, // IMPORTADO (NOVA FEATURE)
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DatabaseOutlined,
  CommentOutlined, // IMPORTADO (NOVA FEATURE)
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api"; // Função da API existente
import AdminEstabelecimentoModal from "@/components/AdminEstabelecimentoModal"; // Modal existente
import {
  Estabelecimento,
  ImagemProduto,
} from "@/types/Interface-Estabelecimento"; // Interface existente

const { Text, Title } = Typography;
const { Column } = Table;
const { TextArea } = Input; // ADICIONADO (NOVA FEATURE)
const { useBreakpoint } = Grid; // ADICIONADO (NOVA FEATURE)

// Enum de Status (mantido do original)
enum StatusEstabelecimento {
  PENDENTE_APROVACAO = "pendente_aprovacao",
  PENDENTE_ATUALIZACAO = "pendente_atualizacao",
  PENDENTE_EXCLUSAO = "pendente_exclusao",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DASHBOARD_PAGE_SIZE = 5; // ADICIONADO (NOVA FEATURE)

// Ícones dos cards (mantido do original)
const listIcons: { [key: string]: React.ReactNode } = {
  "Novos Cadastros": <UserAddOutlined style={{ color: "#52c41a" }} />,
  Atualizações: <EditOutlined style={{ color: "#1890ff" }} />,
  Exclusões: <DeleteOutlined style={{ color: "#f5222d" }} />,
};

// fieldConfig (ESSENCIAL - MANTIDO DO ORIGINAL MEIDESAQUÁ)
// Define os campos e a ordem para ESTABELECIMENTO
const fieldConfig: { [key: string]: { label: string; order: number } } = {
  estabelecimentoId: { label: "ID", order: 1 },
  nomeFantasia: { label: "Nome Fantasia", order: 2 },
  cnpj: { label: "CNPJ", order: 3 },
  categoria: { label: "Categoria", order: 4 },
  status: { label: "Status Atual", order: 5 },
  cnae: { label: "CNAE", order: 6 },
  nomeResponsavel: { label: "Nome do Responsável", order: 10 },
  nome_responsavel: { label: "Nome do Responsável", order: 10 },
  cpfResponsavel: { label: "CPF do Responsável", order: 11 },
  cpf_responsavel: { label: "CPF do Responsável", order: 11 },
  emailEstabelecimento: { label: "Email", order: 20 },
  contatoEstabelecimento: { label: "Contato", order: 21 },
  endereco: { label: "Endereço", order: 22 },
  areasAtuacao: { label: "Áreas de Atuação", order: 23 },

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

  // --- NOVOS ESTADOS (NOVA FEATURE) ---
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPages, setCurrentPages] = useState({
    cadastros: 1,
    atualizacoes: 1,
    exclusoes: 1,
  });

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  // --- FIM DOS NOVOS ESTADOS ---

  // getFullImageUrl (ATUALIZADA - MAIS ROBUSTA)
  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    // Normaliza barras (Windows vs Linux)
    const normalizedPath = path.replace(/\\/g, "/");
    // Remove barra inicial duplicada se houver
    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.substring(1)
      : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  // renderValue (ESSENCIAL - MANTIDO DO ORIGINAL MEIDESAQUÁ)
  // Esta é a função correta que sabe renderizar CCMEI, Produtos, etc.
  const renderValue = (key: string, value: any): React.ReactNode => {
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
      return <Image src={fileUrl} alt={`CCMEI`} width={150} />;
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
                  <Image
                    src={imageUrl}
                    alt={`Produto ${index + 1}`}
                    width={80}
                  />
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
      return <Image src={getFullImageUrl(value)} alt={`Logo`} width={150} />;
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  };

  // fetchData (ATUALIZADO - Reseta a paginação)
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      const pendingData = await getPendingAdminRequests(token);
      setData(pendingData);
      // Reseta a paginação ao buscar novos dados
      setCurrentPages({
        cadastros: 1,
        atualizacoes: 1,
        exclusoes: 1,
      });
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar dados.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // handleAction (ATUALIZADO - Envia motivo de rejeição)
  const handleAction = async (
    action: "approve" | "reject",
    motivoRejeicao?: string
  ) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");

    try {
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Adiciona o body APENAS se for "reject"
      if (action === "reject") {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
        };
        fetchOptions.body = JSON.stringify({
          motivoRejeicao: motivoRejeicao || "",
        });
      }

      // IMPORTANTE: USA O ID DE ESTABELECIMENTO
      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.estabelecimentoId}`,
        fetchOptions
      );

      // Tratamento de erro robusto (NOVA FEATURE)
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Erro do servidor");
        } catch (e) {
          console.error("Erro não-JSON da API:", errorText);
          throw new Error(
            "Falha na comunicação com o servidor. (Recebeu HTML)"
          );
        }
      }

      const result = await response.json();
      message.success(result.message || `Ação executada com sucesso!`);

      // Atualiza os dados
      setData((prevData) => {
        const newData = { ...prevData };
        (Object.keys(newData) as Array<keyof PendingData>).forEach((key) => {
          newData[key] = newData[key].filter(
            (item) => item.estabelecimentoId !== selectedItem.estabelecimentoId
          );
        });
        return newData;
      });

      // Reseta a paginação da lista específica (NOVA FEATURE)
      if (selectedItem.status === StatusEstabelecimento.PENDENTE_APROVACAO) {
        handlePageChange("cadastros")(1);
      } else if (
        selectedItem.status === StatusEstabelecimento.PENDENTE_ATUALIZACAO
      ) {
        handlePageChange("atualizacoes")(1);
      } else if (
        selectedItem.status === StatusEstabelecimento.PENDENTE_EXCLUSAO
      ) {
        handlePageChange("exclusoes")(1);
      }

      setModalVisible(false);
      setIsRejectModalVisible(false); // Fecha o novo modal
      setSelectedItem(null);
      setRejectionReason("");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const showModal = (item: Estabelecimento) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedItem) return;
    setIsEditModalVisible(true);
  };

  // handleEditAndApproveSubmit (ATUALIZADO - Tratamento de erro melhorado)
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
      // IMPORTANTE: USA O ID DE ESTABELECIMENTO
      const response = await fetch(
        `${API_URL}/api/admin/edit-and-approve/${selectedItem.estabelecimentoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setIsEditModalVisible(false);
      setModalVisible(false);
      setSelectedItem(null);
      fetchData(); // Recarrega os dados
    } catch (error: any) {
      setIsActionLoading(false); // Garante que pare o loading no erro
      throw error; // Lança o erro para o modal (AdminEstabelecimentoModal) tratar
    } finally {
      setIsActionLoading(false);
    }
  };

  // renderDiffTable (ESSENCIAL - MANTIDO DO ORIGINAL MEIDESAQUÁ)
  // Esta função está correta para Estabelecimento.
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

    // KeyMap específico para Estabelecimento
    const keyMap: { [newKey: string]: { oldKey: string; labelKey: string } } = {
      logo: { oldKey: "logoUrl", labelKey: "logo" },
      ccmei: { oldKey: "ccmeiUrl", labelKey: "ccmei" },
      produtos: { oldKey: "produtosImg", labelKey: "produtos" },
      nome_responsavel: {
        oldKey: "nomeResponsavel",
        labelKey: "nomeResponsavel",
      },
      cpf_responsavel: {
        oldKey: "cpfResponsavel",
        labelKey: "cpfResponsavel",
      },
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
              render={(value, record: any) => renderValue(record.key, value)}
            />
            <Column
              title="Valor Novo"
              dataIndex="newValue"
              key="newValue"
              width={450}
              render={(value, record: any) => renderValue(record.newKey, value)}
            />
          </Table>
        }
      />
    );
  };

  // handlePageChange (NOVA FEATURE)
  const handlePageChange = (listKey: keyof PendingData) => (page: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [listKey]: page,
    }));
  };

  // renderList (ATUALIZADO - Com paginação e campos de MEI)
  const renderList = (
    title: string,
    listData: Estabelecimento[],
    listKey: keyof PendingData
  ) => {
    const totalCount = listData.length;
    const currentPage = currentPages[listKey];
    const pagedData = listData.slice(
      (currentPage - 1) * DASHBOARD_PAGE_SIZE,
      currentPage * DASHBOARD_PAGE_SIZE
    );

    return (
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
            <>
              <List
                dataSource={pagedData} // Usa dados paginados
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
                          icon={listIcons[title]}
                        />
                      }
                      // IMPORTANTE: Campos adaptados para ESTABELECIMENTO
                      title={item.nomeFantasia}
                      description={`CNPJ: ${item.cnpj}`}
                    />
                  </List.Item>
                )}
              />
              {/* Renderiza a paginação */}
              {totalCount > DASHBOARD_PAGE_SIZE && (
                <div className="mt-4 text-center">
                  <Pagination
                    current={currentPage}
                    pageSize={DASHBOARD_PAGE_SIZE}
                    total={totalCount}
                    onChange={handlePageChange(listKey)}
                    size="small"
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <Empty description="Nenhuma solicitação" />
          )}
        </Card>
      </Col>
    );
  };

  return (
    <div className="p-8">
      <Spin spinning={loading}>
        {/* CABEÇALHO ATUALIZADO (Responsivo + Botão Comentários) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <Title
            level={isMobile ? 3 : 2}
            className="m-0 md:text-left text-center"
          >
            Painel de Administração
          </Title>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {/* Link adaptado para ESTABELECIMENTOS */}
            <Link href="/admin/estabelecimentos-ativos" passHref>
              <Button
                type="primary"
                icon={<DatabaseOutlined />}
                size="large"
                className={isMobile ? "w-full" : ""}
              >
                Gerenciar Estabelecimentos Ativos
              </Button>
            </Link>

            {/* Link novo para COMENTÁRIOS */}
            <Link href="/admin/comentarios" passHref>
              <Button
                icon={<CommentOutlined />}
                size="large"
                style={{ backgroundColor: "#3C6AB2", color: "#fff" }}
                className={isMobile ? "w-full" : ""}
              >
                Gerenciar Comentários
              </Button>
            </Link>
          </div>
        </div>

        {/* Chamada do renderList atualizada */}
        <Row gutter={[16, 16]}>
          {renderList("Novos Cadastros", data.cadastros, "cadastros")}
          {renderList("Atualizações", data.atualizacoes, "atualizacoes")}
          {renderList("Exclusões", data.exclusoes, "exclusoes")}
        </Row>
      </Spin>

      {selectedItem && (
        <Modal
          title={`Detalhes de ${selectedItem.nomeFantasia}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={1000}
          // FOOTER ATUALIZADO (Botão "Recusar" abre novo modal + Ordem)
          footer={[
            <Button
              key="reject"
              onClick={() => setIsRejectModalVisible(true)} // ABRE MODAL DE REJEIÇÃO
              icon={<CloseOutlined />}
              danger
              loading={isActionLoading}
            >
              Recusar
            </Button>,
            selectedItem.status !== StatusEstabelecimento.PENDENTE_EXCLUSAO && (
              <Button
                key="edit_and_approve"
                onClick={handleOpenEditModal}
                icon={<EditOutlined />}
                loading={isActionLoading}
              >
                Editar e Aprovar
              </Button>
            ),
            selectedItem.status !== StatusEstabelecimento.PENDENTE_EXCLUSAO ? (
              <Button
                key="approve_direct"
                type="primary" // Botão de aprovação principal
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
          ]}
        >
          {/* Conteúdo do Modal (ESSENCIAL - MANTIDO DO ORIGINAL MEIDESAQUÁ) */}
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
              .map(
                ([key, value]) =>
                  fieldConfig[key] && ( // Garante que só renderiza campos do config
                    <Descriptions.Item
                      key={key}
                      label={fieldConfig[key]?.label ?? key}
                    >
                      {renderValue(key, value)}
                    </Descriptions.Item>
                  )
              )}
          </Descriptions>

          {/* Tabelas de Diff (MANTIDAS DO ORIGINAL) */}
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
        </Modal>
      )}

      {/* Modal de Edição (ESSENCIAL - MANTIDO DO ORIGINAL MEIDESAQUÁ) */}
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

      {/* --- NOVO MODAL DE REJEIÇÃO (NOVA FEATURE) --- */}
      <Modal
        title="Confirmar Rejeição"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectionReason(""); // Limpa ao cancelar
        }}
        onOk={() => handleAction("reject", rejectionReason)}
        confirmLoading={isActionLoading}
        okText="Confirmar Rejeição"
        cancelText="Voltar"
        okButtonProps={{ danger: true }}
      >
        <Typography.Text strong className="block mb-2">
          Por favor, informe o motivo da rejeição (será enviado ao usuário):
        </Typography.Text>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="O cadastro foi rejeitado pois..."
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;