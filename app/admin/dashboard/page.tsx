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
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

// URL da sua API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Estabelecimento {
  estabelecimentoId: number;
  nomeFantasia: string;
  cnpj: string;
  // Adicione outros campos que você queira exibir
  [key: string]: any;
}

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado. Faça login primeiro.");
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("admin_token");
        message.error("Sessão expirada. Faça login novamente.");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Falha ao buscar os dados.");
      }

      const pendingData = await response.json();
      setData(pendingData);
    } catch (error: any) {
      message.error(error.message || "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedItem) return;

    const token = localStorage.getItem("admin_token");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.estabelecimentoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      message.success(
        `Solicitação ${
          action === "approve" ? "aprovada" : "rejeitada"
        } com sucesso!`
      );
      setModalVisible(false);
      fetchData(); // Recarrega os dados para atualizar a lista
    } catch (error: any) {
      message.error(error.message || `Erro ao processar a solicitação.`);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (item: Estabelecimento) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderList = (
    title: string,
    listData: Estabelecimento[],
    icon: React.ReactNode
  ) => (
    <Col xs={24} md={12} lg={8}>
      <Card
        title={
          <span className="font-semibold text-lg">
            {icon} {title} ({listData.length})
          </span>
        }
        className="shadow-lg rounded-lg h-full"
      >
        {listData.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => showModal(item)}>
                    Ver Detalhes
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.nomeFantasia}
                  description={`CNPJ: ${item.cnpj}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Nenhuma solicitação pendente" />
        )}
      </Card>
    </Col>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Spin spinning={loading} tip="Processando...">
        <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
        <Row gutter={[24, 24]}>
          {renderList("Novos Cadastros", data.cadastros, <UserAddOutlined />)}
          {renderList(
            "Solicitações de Atualização",
            data.atualizacoes,
            <EditOutlined />
          )}
          {renderList(
            "Solicitações de Exclusão",
            data.exclusoes,
            <DeleteOutlined />
          )}
        </Row>
      </Spin>

      {selectedItem && (
        <Modal
          title={`Detalhes da Solicitação - ${selectedItem.nomeFantasia}`}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button
              key="reject"
              onClick={() => handleAction("reject")}
              icon={<CloseOutlined />}
              danger
            >
              Recusar
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={() => handleAction("approve")}
              icon={<CheckOutlined />}
            >
              Confirmar
            </Button>,
          ]}
        >
          <Descriptions bordered column={1} size="small">
            {/* Exibe todos os dados do MEI, incluindo os de atualização se existirem */}
            {Object.entries(selectedItem)
              .filter(([key]) => key !== "dados_atualizacao")
              .map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {String(value)}
                </Descriptions.Item>
              ))}
            {selectedItem.dados_atualizacao &&
              Object.keys(selectedItem.dados_atualizacao).length > 0 && (
                <Descriptions.Item
                  label="Dados para Atualizar"
                  style={{ backgroundColor: "#e6f7ff" }}
                >
                  {Object.entries(selectedItem.dados_atualizacao).map(
                    ([key, value]) => (
                      <div key={key}>
                        <Text strong>{key}:</Text> {String(value)}
                      </div>
                    )
                  )}
                </Descriptions.Item>
              )}
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
