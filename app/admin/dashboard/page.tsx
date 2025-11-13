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
  Input,
  Select,
  Pagination,
  Grid,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DatabaseOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests, adminUpdateEstablishment } from "@/lib/api";
import AdminEstabelecimentoModal from "@/components/AdminEstabelecimentoModal";
import { Estabelecimento } from "@/types/Interface-Estabelecimento";
import FormattedDescription from "@/components/FormattedDescription";

const { Text, Title } = Typography;
const { Column } = Table;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

// Enum adaptado para Estabelecimento
enum StatusEstabelecimento {
  PENDENTE_APROVACAO = "pendente_aprovacao",
  PENDENTE_ATUALIZACAO = "pendente_atualizacao",
  PENDENTE_EXCLUSAO = "pendente_exclusao",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DASHBOARD_PAGE_SIZE = 5;

// Objeto para os ícones dos cards
const listIcons: { [key: string]: React.ReactNode } = {
  "Novos Cadastros": <UserAddOutlined style={{ color: "#52c41a" }} />,
  Atualizações: <EditOutlined style={{ color: "#1890ff" }} />,
  Exclusões: <DeleteOutlined style={{ color: "#f5222d" }} />,
};

// Interface de dados adaptada
interface PendingData {
  cadastros: Estabelecimento[];
  atualizacoes: Estabelecimento[];
  exclusoes: Estabelecimento[];
}

// fieldConfig ORIGINAL do MeideSaquá
const fieldConfig: { [key: string]: { label: string; order: number } } = {

// dados do responsável
  nomeResponsavel: { label: "Nome do Responsável", order: 1 },
  cpfResponsavel: { label: "CPF do Responsável", order: 2 },
  emailEstabelecimento: { label: "Email", order: 3 },
  
// dados do MEI
  estabelecimentoId: { label: "ID", order: 1 },
  nomeFantasia: { label: "Nome Fantasia", order: 2 },
  cnpj: { label: "CNPJ", order: 3 },
  categoria: { label: "Categoria", order: 4 },
  tagsInvisiveis: { label: "Tags", order: 5 },
  cnae: { label: "CNAE", order: 6 },
  venda: { label: "Canais de Venda", order: 7 },
  escala: { label: "Escala de Impacto", order: 8 },
  contatoEstabelecimento: { label: "Contato", order: 9 },
  endereco: { label: "Endereço", order: 10 },
  areasAtuacao: { label: "Áreas de Atuação", order: 11 },
  descricao: { label: "Descrição", order: 12 },
  descricaoDiferencial: { label: "Diferencial", order: 13 },
  website: { label: "Website", order: 14 },
  instagram: { label: "Instagram", order: 15 },
  ccmeiUrl: { label: "CCMEI Atual", order: 16 },
  logoUrl: { label: "Logo Atual", order: 17 },
  produtosImg: { label: "Portfólio Atual", order: 18 },

  //atualização
  status: { label: "Status Atual", order: 5 },
  outrasAlteracoes: { label: "Outras Alterações", order: 6 }, // <-- Feature nova
  logo: { label: "Nova Logo", order: 17 },
  ccmei: { label: "Novo CCMEI", order: 16 },
  produtos: { label: "Novo Portfólio", order: 18 },
  motivo: { label: "Motivo da Exclusão", order: 1000 },
  motivoExclusao: { label: "Motivo da Exclusão", order: 15 },
  createdAt: { label: "Data de Criação", order: 100 },
  updatedAt: { label: "Última Atualização", order: 101 },
};

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
  ); // <-- Tipo Corrigido
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [currentPages, setCurrentPages] = useState({
    cadastros: 1,
    atualizacoes: 1,
    exclusoes: 1,
  });

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.substring(1)
      : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  // renderValue ORIGINAL do MeideSaquá
  const renderValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return <Text type="secondary">Não informado</Text>;
    }
    if (key === "descricao") {
      return (
        <div
          className="prose prose-sm max-w-none prose-p:my-1"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }

    if (key === "descricaoDiferencial") {
      return <FormattedDescription text={value} />;
    }

    if (
      key === "motivo" ||
      key === "motivoExclusao" ||
      key === "outrasAlteracoes"
    ) {
      return (
        <Typography.Paragraph style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {String(value)}
        </Typography.Paragraph>
      );
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

    // Lógica para renderizar Portfólio (produtosImg)
    if (
      (key === "produtosImg" || key === "produtos") &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      const imagesUrls = value
        .map((item) => (typeof item === "string" ? item : item.url))
        .map(getFullImageUrl)
        .filter(Boolean);

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

    if (
      (key === "logoUrl" || key === "logo") &&
      typeof value === "string" &&
      value
    ) {
      return <Image src={getFullImageUrl(value)} alt="Logo" width={150} />;
    }

    if (typeof value === "object" && value !== null)
      return JSON.stringify(value);

    // Lógica para tags/areas (que são arrays)
    if (
      (key === "tagsInvisiveis" || key === "areasAtuacao") &&
      Array.isArray(value)
    ) {
      return value.join(", ");
    }

    return String(value);
  };

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

      if (action === "reject") {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
        };
        fetchOptions.body = JSON.stringify({
          motivoRejeicao: motivoRejeicao || "",
        });
      }

      // Endpoint corrigido para estabelecimentoId
      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.estabelecimentoId}`,
        fetchOptions
      );

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

      setData((prevData) => {
        const newData = { ...prevData };
        (Object.keys(newData) as Array<keyof PendingData>).forEach((key) => {
          // ID corrigido para estabelecimentoId
          newData[key] = newData[key].filter(
            (item) => item.estabelecimentoId !== selectedItem.estabelecimentoId
          );
        });
        return newData;
      });

      // Lógica de paginação adaptada
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
      setIsRejectModalVisible(false);
      setSelectedItem(null);
      setRejectionReason("");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const showModal = (item: Estabelecimento) => {
    // <-- Tipo Corrigido
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedItem) return;
    setIsEditModalVisible(true);
  };

  // handleEditAndApproveSubmit adaptado para FormData
  const handleEditAndApproveSubmit = async (formData: FormData) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      setIsActionLoading(false);
      return;
    }

    try {
      // Usa a função da API já corrigida, que envia FormData
      await adminUpdateEstablishment(
        selectedItem.estabelecimentoId,
        formData,
        token
      );

      // A mensagem de sucesso é mostrada pelo modal
      setIsEditModalVisible(false);
      setModalVisible(false);
      setSelectedItem(null);
      fetchData(); // Recarrega os dados
    } catch (error: any) {
      setIsActionLoading(false);
      throw error; // Lança o erro para o modal tratar
    } finally {
      setIsActionLoading(false);
    }
  };

  // renderDiffTable adaptado
  const renderDiffTable = (
    status: "pendente_atualizacao" | "pendente_exclusao",
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

    // Mapa de chaves do MeideSaquá
    const keyMap: { [newKey: string]: { oldKey: string; labelKey: string } } = {
      logo: { oldKey: "logoUrl", labelKey: "logo" },
      produtos: { oldKey: "produtosImg", labelKey: "produtos" }, // 'produtos' em vez de 'imagens'
      ccmei: { oldKey: "ccmeiUrl", labelKey: "ccmei" }, // 'ccmei'
      nome_responsavel: {
        oldKey: "nomeResponsavel",
        labelKey: "nome_responsavel",
      },
      cpf_responsavel: {
        oldKey: "cpfResponsavel",
        labelKey: "cpf_responsavel",
      },
    };

    const diffData = Object.entries(selectedItem.dados_atualizacao)
      .filter(([key]) => !keysToFilter.includes(key))
      .map(([key, newValue]) => {
        const mapping = keyMap[key];
        const oldKey = mapping ? mapping.oldKey : key;
        const labelKey = mapping ? mapping.labelKey : key;

        const oldValue = selectedItem[oldKey];
        const fieldLabel = fieldConfig[labelKey]?.label ?? `Novo ${key}`;

        let finalLabel = fieldLabel;
        if (labelKey === "produtos") finalLabel = "Portfólio";
        if (labelKey === "logo") finalLabel = "Logo";
        if (labelKey === "ccmei") finalLabel = "CCMEI";
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

  const handlePageChange = (listKey: keyof PendingData) => (page: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [listKey]: page,
    }));
  };

  // renderList adaptado
  const renderList = (
    title: string,
    listData: Estabelecimento[], // <-- Tipo Corrigido
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
                dataSource={pagedData}
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
                      title={item.nomeFantasia} // <-- Campo Corrigido
                      description={`CNPJ: ${item.cnpj}`} // <-- Campo Corrigido
                    />
                  </List.Item>
                )}
              />
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

  // ====================================================================
  //               ⬇️ INÍCIO DA MODIFICAÇÃO DO MODAL ⬇️
  // ====================================================================

  /**
   * Função auxiliar para renderizar um grupo de descrições dentro de um Card.
   * Agrupa os campos com base nas chaves fornecidas.
   */
  const renderDescriptionGroup = (
    title: string,
    entries: [string, any][]
  ) => {
    // Não renderiza o card se não houver campos para exibir
    const visibleEntries = entries.filter(([key]) => fieldConfig[key]);
    if (visibleEntries.length === 0) return null;

    return (
      <Card type="inner" title={title} className="mb-4">
        <Descriptions bordered column={1} size="small">
          {visibleEntries.map(
            ([key, value]) =>
              fieldConfig[key] && (
                <Descriptions.Item
                  key={key}
                  label={fieldConfig[key]?.label ?? key}
                >
                  {renderValue(key, value)}
                </Descriptions.Item>
              )
          )}
        </Descriptions>
      </Card>
    );
  };

  /**
   * Função para preparar os dados agrupados para o modal.
   * Esta função será chamada dentro do componente Modal.
   */
  const getGroupedEntries = (item: Estabelecimento) => {
    // 1. Define as chaves para cada seção, conforme a imagem
    const keysResponsavel = ["nomeResponsavel", "cpfResponsavel", "emailEstabelecimento",];
    const keysMei = [
      "estabelecimentoId",
      "nomeFantasia",
      "cnpj",
      "cnae",
      "categoria",
      "contatoEstabelecimento",
      "endereco",
      "website",
      "instagram",
      "tagsInvisiveis",
      "descricao",
      "descricaoDiferencial",
      "areasAtuacao",
      "logoUrl",
      "produtosImg",
      "ccmeiUrl",
      "venda",
      "escala",
    ];

    // 2. Obtém todas as entradas válidas e ordenadas (lógica original)
    const allEntries = Object.entries(item)
      .filter(
        ([key]) =>
          key !== "dados_atualizacao" &&
          key !== "status"
      )
      .sort(
        ([keyA], [keyB]) =>
          (fieldConfig[keyA]?.order ?? 999) -
          (fieldConfig[keyB]?.order ?? 999)
      );

    // 3. Filtra as entradas para cada grupo
    const entriesResponsavel = allEntries.filter(([key]) =>
      keysResponsavel.includes(key)
    );
    const entriesMei = allEntries.filter(([key]) => keysMei.includes(key));
    const entriesMetadados = allEntries.filter(
      ([key]) =>
        !keysResponsavel.includes(key) && !keysMei.includes(key)
    );

    return { entriesResponsavel, entriesMei, entriesMetadados };
  };

  // ====================================================================
  //               ⬆️ FIM DA MODIFICAÇÃO DO MODAL ⬆️
  // ====================================================================

  return (
    <div className="p-8">
      <Spin spinning={loading}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <Title
            level={isMobile ? 3 : 2}
            className="m-0 md:text-left text-center"
          >
            Painel de Administração
          </Title>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {/* Link Corrigido */}
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

            <Link href="/admin/comentarios" passHref>
              <Button
                icon={<CommentOutlined />}
                size="large"
                style={{ backgroundColor: "#3C6AB2", color: "#fff" }} // Pode ajustar a cor
                className={isMobile ? "w-full" : ""}
              >
                Gerenciar Comentários
              </Button>
            </Link>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {renderList("Novos Cadastros", data.cadastros, "cadastros")}
          {renderList("Atualizações", data.atualizacoes, "atualizacoes")}
          {renderList("Exclusões", data.exclusoes, "exclusoes")}
        </Row>
      </Spin>

      {selectedItem && (
        <Modal
          title={`Detalhes de ${selectedItem.nomeFantasia}`} // <-- Campo Corrigido
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={1000}
          footer={[
            <Button
              key="reject"
              onClick={() => setIsRejectModalVisible(true)}
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
                type="primary"
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
          {/* ====================================================================
                            ⬇️ ÁREA DO MODAL MODIFICADA ⬇️
            ====================================================================
          */}

          {/* Prepara os dados agrupados */}
          {(() => {
            const { entriesResponsavel, entriesMei, entriesMetadados } =
              getGroupedEntries(selectedItem);

            return (
              <>
                <Title level={4} className="mb-4">
                  Dados do Estabelecimento
                </Title>

                {/* Grupo 1: Identificação do Responsável */}
                {renderDescriptionGroup(
                  "1. Identificação do Responsável",
                  entriesResponsavel
                )}

                {/* Grupo 2: Identificação do Mei */}
                {renderDescriptionGroup(
                  "2. Identificação do Mei",
                  entriesMei
                )}

                {/* Grupo 3: Metadados */}
                {renderDescriptionGroup("3. Metadados", entriesMetadados)}
              </>
            );
          })()}

          {/* ====================================================================
                            ⬆️ ÁREA DO MODAL MODIFICADA ⬆️
            ====================================================================
          */}

          {/* As tabelas de Diffs (atualização/exclusão) permanecem abaixo dos dados */}
          {renderDiffTable(
            "pendente_exclusao",
            "error",
            "Solicitação de Exclusão",
            ["estabelecimentoId", "confirmacao"] 
          )}
          {renderDiffTable(
            "pendente_atualizacao",
            "info",
            "Dados para Atualizar",
            ["motivoExclusao", "venda", "escala"]
          )}
        </Modal>
      )}

      {/* ---MODAL DE EDIÇÃO --- */}
      <AdminEstabelecimentoModal // <-- Componente Corrigido
        estabelecimento={selectedItem} // <-- Prop Corrigida
        visible={isEditModalVisible}
        onClose={(shouldRefresh: boolean) => {
          // <-- Tipo 'boolean' adicionado
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
      {/* --- MODAL DE REJEIÇÃO --- */}
      <Modal
        title="Confirmar Rejeição"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectionReason("");
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
          placeholder="O cadastro foi rejeitado pois..." // <-- Texto Corrigido
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;