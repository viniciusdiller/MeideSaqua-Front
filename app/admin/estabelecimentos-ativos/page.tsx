// app/admin/estabelecimentos-ativos/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Spin,
  Typography,
  message,
  Empty,
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Tabs,
  Input,
  Popconfirm,
  Grid,
  Pagination,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getAllActiveEstablishments, // <-- API MeideSaquá
  adminDeleteEstablishment, // <-- API MeideSaquá
} from "@/lib/api";
import AdminEstabelecimentoModal from "@/components/AdminEstabelecimentoModal"; // <-- Modal MeideSaquá
import { Estabelecimento } from "@/types/Interface-Estabelecimento"; // <-- Interface MeideSaquá

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 6; // 6 estabelecimentos por página (em cada aba)

const getFullImageUrl = (path: string): string => {
  if (!path) return "";
  const normalizedPath = path.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.substring(1)
    : normalizedPath;
  return `${API_URL}/${cleanPath}`;
};

const EstabelecimentosAtivosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>(
    []
  );
  const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState<
    Estabelecimento[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<Estabelecimento | null>(
    null
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const screens = useBreakpoint();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      // Usando a API do MeideSaquá
      const data = await getAllActiveEstablishments(token);
      setEstabelecimentos(data);
      setFilteredEstabelecimentos(data);
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar estabelecimentos.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = estabelecimentos.filter(
      (p) =>
        p.nomeFantasia.toLowerCase().includes(lowerCaseValue) ||
        (p.cnpj || "").toLowerCase().includes(lowerCaseValue) ||
        p.categoria.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredEstabelecimentos(filtered);
    setCurrentPage(1); // Reseta a paginação ao buscar
  };

  const openEditModal = (est: Estabelecimento) => {
    setSelectedItem(est);
    setIsEditModalVisible(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
    if (shouldRefresh) {
      fetchData(); // Recarrega os dados se o modal salvar
    }
  };

  const handleDelete = async (estId: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      return;
    }

    setLoading(true);
    try {
      // Usando a API de delete do MeideSaquá
      await adminDeleteEstablishment(estId, token);
      message.success("Estabelecimento excluído com sucesso!");
      fetchData(); // Recarrega os dados
    } catch (error: any) {
      message.error(error.message || "Falha ao excluir o estabelecimento.");
      setLoading(false);
    }
  };

  // Reseta a página ao trocar de aba
  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Agrupa os estabelecimentos por Categoria
  const groupedEstabelecimentos = filteredEstabelecimentos.reduce(
    (acc, est) => {
      const categoria = est.categoria || "Sem Categoria";
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(est);
      return acc;
    },
    {} as { [key: string]: Estabelecimento[] }
  );

  // Ordena as categorias alfabeticamente
  const sortedCategories = Object.keys(groupedEstabelecimentos).sort((a, b) =>
    a.localeCompare(b)
  );

  const tabPosition = screens.md ? "left" : "top";

  return (
    <div className="p-4 md:p-8">
      <Link href="/admin/dashboard" passHref>
        <Button icon={<ArrowLeftOutlined />} type="text" className="mb-4">
          Voltar ao Dashboard
        </Button>
      </Link>

      <Title level={2} className="mb-6">
        Gerenciar Estabelecimentos Ativos ({filteredEstabelecimentos.length})
      </Title>

      <Search
        placeholder="Buscar por nome fantasia, CNPJ ou categoria..."
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        enterButton
        size="large"
        className="mb-6"
      />

      <Spin spinning={loading}>
        {filteredEstabelecimentos.length === 0 && !loading ? (
          <Empty description="Nenhum estabelecimento ativo encontrado." />
        ) : (
          <Tabs
            defaultActiveKey={sortedCategories[0]} // Inicia na primeira categoria
            tabPosition={tabPosition}
            onChange={handleTabChange}
          >
            {sortedCategories.map((categoria) => {
              // Lógica de paginação por aba
              const allEstabelecimentosForCat = groupedEstabelecimentos[categoria];
              const totalCount = allEstabelecimentosForCat.length;
              const estabelecimentosToShow = allEstabelecimentosForCat.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
              );

              return (
                <TabPane
                  tab={`${categoria} (${allEstabelecimentosForCat.length})`}
                  key={categoria}
                >
                  <Row gutter={[16, 16]}>
                    {estabelecimentosToShow.map((est) => (
                      <Col xs={24} md={12} lg={8} key={est.estabelecimentoId}>
                        <Card
                          hoverable
                          actions={[
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => openEditModal(est)}
                              className="hover:!bg-blue-500 hover:!text-white"
                            >
                              Editar
                            </Button>,
                            <Popconfirm
                              key="delete"
                              title="Excluir Estabelecimento"
                              description="Tem certeza que deseja excluir este MEI? Esta ação não pode ser desfeita."
                              onConfirm={() =>
                                handleDelete(est.estabelecimentoId)
                              }
                              okText="Sim, Excluir"
                              cancelText="Não"
                              okButtonProps={{ danger: true }}
                            >
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                className="hover:!bg-red-500 hover:!text-white"
                              >
                                Excluir
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          <Card.Meta
                            avatar={
                              <Avatar
                                src={getFullImageUrl(est.logoUrl || "")}
                              />
                            }
                            title={est.nomeFantasia}
                            description={
                              <>
                                <Text>
                                  <strong>ID:</strong> {est.estabelecimentoId}
                                </Text>
                                <br />
                                <Text>
                                  <strong>CNPJ:</strong> {est.cnpj}
                                </Text>
                                <br />
                                <Text>
                                  <strong>Responsável:</strong>{" "}
                                  {est.nomeResponsavel}
                                </Text>
                              </>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Renderiza o componente de paginação da aba */}
                  {totalCount > PAGE_SIZE && (
                    <div className="mt-6 text-center">
                      <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={totalCount}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                      />
                    </div>
                  )}
                </TabPane>
              );
            })}
          </Tabs>
        )}
      </Spin>

      {/* Modal de Edição do MeideSaquá */}
      <AdminEstabelecimentoModal
        estabelecimento={selectedItem}
        visible={isEditModalVisible}
        onClose={handleModalClose}
        mode="edit-only"
        // Passa uma função vazia pois o modal "edit-only" não usa
        onEditAndApprove={async () => {}}
      />
    </div>
  );
};

export default EstabelecimentosAtivosPage;