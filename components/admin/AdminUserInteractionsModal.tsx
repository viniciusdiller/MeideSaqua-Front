import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  List,
  Tag,
  Typography,
  Rate,
  Spin,
  Space,
  Button,
  message,
} from "antd";
import {
  HistoryOutlined,
  ShopOutlined,
  CommentOutlined,
  StarOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import { adminGetUserInteractions } from "@/lib/api";

const { Text, Paragraph } = Typography;

interface User {
  usuarioId: number;
  nomeCompleto: string;
  username: string;
  email: string;
  enabled: boolean;
}

interface AdminUserInteractionsModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export const AdminUserInteractionsModal: React.FC<
  AdminUserInteractionsModalProps
> = ({ visible, user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [interactionsData, setInteractionsData] = useState<any>(null);

  useEffect(() => {
    if (visible && user) {
      fetchInteractions(user.usuarioId);
    } else {
      setInteractionsData(null);
    }
  }, [visible, user]);

  const fetchInteractions = async (userId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("Sessão expirada");

      const data = await adminGetUserInteractions(userId, token);

      // Log para ajudar a debugar se os dados do backend estão chegando corretamente
      console.log("Interações carregadas:", data);

      setInteractionsData(data);
    } catch (error: any) {
      console.error(error);
      message.error(error.message || "Falha ao carregar as interações.");
      setInteractionsData({ meis: [], comentarios: [], avaliacoes: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <HistoryOutlined className="text-purple-600" />
          </div>
          <div className="flex flex-col">
            <Text strong className="text-lg leading-tight">
              Registro de Atividades
            </Text>
            {user && (
              <Text type="secondary" className="text-xs">
                {user.nomeCompleto} (@{user.username})
              </Text>
            )}
          </div>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Fechar
        </Button>,
      ]}
      width={700}
      centered
      destroyOnHidden
      className="modern-modal"
    >
      <Spin spinning={loading} tip="Buscando histórico do usuário...">
        <div className="mt-4 min-h-[300px]">
          {interactionsData && (
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: (
                    <span className="font-medium">
                      <ShopOutlined /> MEIs Cadastrados
                    </span>
                  ),
                  children: (
                    <List
                      dataSource={interactionsData.meis}
                      locale={{
                        emptyText: "Nenhum estabelecimento cadastrado.",
                      }}
                      renderItem={(mei: any) => (
                        <List.Item className="bg-gray-50 mb-2 rounded-lg px-4 border border-gray-100">
                          <List.Item.Meta
                            title={<Text strong>{mei.nome}</Text>}
                            description={`Categoria: ${mei.categoria}`}
                          />
                          <Tag
                            color={mei.status === "Ativo" ? "green" : "orange"}
                          >
                            {mei.status}
                          </Tag>
                        </List.Item>
                      )}
                    />
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span className="font-medium">
                      <CommentOutlined /> Comentários
                    </span>
                  ),
                  children: (
                    <List
                      dataSource={interactionsData.comentarios}
                      locale={{ emptyText: "Nenhum comentário registrado." }}
                      renderItem={(comentario: any) => (
                        <List.Item className="bg-gray-50 mb-2 rounded-lg px-4 border border-gray-100 flex-col items-start">
                          <div className="w-full flex justify-between mb-1">
                            <Text type="secondary" className="text-xs">
                              Em:{" "}
                              <Text strong className="text-gray-700">
                                {comentario.estabelecimento}
                              </Text>
                            </Text>
                          </div>
                          <Paragraph className="m-0 italic text-gray-600">
                            "{comentario.texto}"
                          </Paragraph>
                        </List.Item>
                      )}
                    />
                  ),
                },
                {
                  key: "3",
                  label: (
                    <span className="font-medium">
                      <StarOutlined /> Avaliações
                    </span>
                  ),
                  children: (
                    <List
                      dataSource={interactionsData.avaliacoes}
                      locale={{ emptyText: "Nenhuma avaliação registrada." }}
                      renderItem={(aval: any) => (
                        <List.Item className="bg-gray-50 mb-2 rounded-lg px-4 border border-gray-100">
                          <List.Item.Meta
                            title={
                              <Text type="secondary" className="text-xs">
                                Avaliou o estabelecimento:
                              </Text>
                            }
                            description={
                              <Text strong className="text-gray-700">
                                {aval.estabelecimento}
                              </Text>
                            }
                          />
                          <div className="flex flex-col items-end">
                            <Rate
                              disabled
                              defaultValue={aval.nota}
                              className="text-sm"
                            />
                            <Text type="secondary" className="text-[10px] mt-1">
                              {aval.data}
                            </Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  ),
                },
              ]}
            />
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default AdminUserInteractionsModal;
