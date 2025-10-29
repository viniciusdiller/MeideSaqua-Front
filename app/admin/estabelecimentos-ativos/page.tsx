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
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getAllActiveEstablishments, // NOVA função da API
  adminDeleteEstablishment, // NOVA função da API
} from "@/lib/api";
// import AdminEstabelecimentoModal from "@/components/AdminEstabelecimentoModal"; // Assumindo que você criará este modal
import { Estabelecimento } from "@/types/Interface-Estabelecimento"; // NOVO tipo

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para obter URL completa da imagem
const getFullImageUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path; // Já é uma URL completa
  const normalizedPath = path.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.substring(1)
    : normalizedPath;
  return `${API_URL}/${cleanPath}`;
};

const EstabelecimentosAtivosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState<
    Estabelecimento[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<Estabelecimento | null>(
    null
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const router = useRouter();

  // Busca os dados (similar ao de projetos)
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      // Usa a nova função da API
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

  // Lógica de busca (adaptada para estabelecimento)
  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = estabelecimentos.filter(
      (e) =>
        e.nomeFantasia.toLowerCase().includes(lowerCaseValue) ||
        e.cnpj.toLowerCase().includes(lowerCaseValue) ||
        (e.categoria &&
          e.categoria.toLowerCase().includes(lowerCaseValue))
    );
    setFilteredEstabelecimentos(filtered);
  };

  const openEditModal = (estabelecimento: Estabelecimento) => {
    setSelectedItem(estabelecimento);
    setIsEditModalVisible(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
    if (shouldRefresh) {
      fetchData(); // Recarrega os dados se uma edição foi salva
    }
  };

  // Lógica de exclusão (adaptada para estabelecimento)
  const handleDelete = async (estabelecimentoId: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      return;
    }

    setLoading(true);
    try {
      // Usa a nova função da API
      await adminDeleteEstablishment(estabelecimentoId, token);
      message.success("Estabelecimento excluído com sucesso!");
      fetchData(); // Recarrega a lista
    } catch (error: any) {
      message.error(error.message || "Falha ao excluir o estabelecimento.");
      setLoading(false);
    }
  };

  // Agrupa os estabelecimentos por CATEGORIA (em vez de ODS)
  const groupedEstabelecimentos = filteredEstabelecimentos.reduce(
    (acc, estabelecimento) => {
      const categoria = estabelecimento.categoria || "Sem Categoria";
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(estabelecimento);
      return acc;
    },
    {} as { [key: string]: Estabelecimento[] }
  );

  const sortedCategories = Object.keys(groupedEstabelecimentos).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="p-8">
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
          <Tabs defaultActiveKey={sortedCategories[0]} tabPosition="left">
            {sortedCategories.map((categoria) => (
              <TabPane
                tab={`${categoria} (${groupedEstabelecimentos[categoria].length})`}
                key={categoria}
              >
                <Row gutter={[16, 16]}>
                  {groupedEstabelecimentos[categoria].map((estabelecimento) => (
                    <Col
                      xs={24}
                      md={12}
                      lg={8}
                      key={estabelecimento.estabelecimentoId}
                    >
                      <Card
                        hoverable
                        actions={[
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(estabelecimento)}
                          >
                            Editar
                          </Button>,
                          <Popconfirm
                            key="delete"
                            title="Excluir Estabelecimento"
                            description="Tem certeza que deseja excluir este estabelecimento? Esta ação não pode ser desfeita."
                            onConfirm={() =>
                              handleDelete(estabelecimento.estabelecimentoId)
                            }
                            okText="Sim, Excluir"
                            cancelText="Não"
                            okButtonProps={{ danger: true }}
                          >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                              Excluir
                            </Button>
                          </Popconfirm>,
                        ]}
                      >
                        <Card.Meta
                          avatar={
                            <Avatar
                              src={getFullImageUrl(
                                estabelecimento.logoUrl || ""
                              )}
                            />
                          }
                          title={estabelecimento.nomeFantasia}
                          description={
                            <>
                              <Text>CNPJ: {estabelecimento.cnpj}</Text>
                              <br />
                              <Text type="secondary">
                                {estabelecimento.status}
                              </Text>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            ))}
          </Tabs>
        )}
      </Spin>

      {/* NOTA: Você precisará criar o componente AdminEstabelecimentoModal,
        assim como você tinha o AdminProjetoModal.
      */}
      {/* {selectedItem && (
        <AdminEstabelecimentoModal
          estabelecimento={selectedItem}
          visible={isEditModalVisible}
          onClose={handleModalClose}
          mode="edit-only"
        />
      )} */}
    </div>
  );
};

export default EstabelecimentosAtivosPage;