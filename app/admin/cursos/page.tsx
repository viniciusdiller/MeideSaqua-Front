"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Upload,
  List,
  message,
  Typography,
  Spin,
  Empty,
  Popconfirm,
  Tag,
  Tooltip,
  Divider,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CloseOutlined,
  SearchOutlined,
  PlusOutlined,
  PictureOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const { Title, Text } = Typography;

// Interface adaptada para Cursos
interface CursoCard {
  id: number;
  titulo: string;
  link: string;
  imagemUrl: string;
}

const AdminCursos = () => {
  const [cards, setCards] = useState<CursoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados de Filtro e Paginação
  const [searchText, setSearchText] = useState("");

  // Estado para Edição
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form States
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- CORREÇÃO DO ERRO DE URL ---
  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path || path.trim() === "") return "/placeholder-logo.png";

    if (
      path.startsWith("http") ||
      path.startsWith("https") ||
      path.startsWith("data:")
    ) {
      return path;
    }

    const baseUrl = API_URL || "";

    if (baseUrl) {
      const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${cleanBase}${cleanPath}`;
    }

    return path.startsWith("/") ? path : `/${path}`;
  };

  const fetchCards = async () => {
    setLoading(true);
    try {
      // Verifica se API_URL está definida para evitar erro no fetch
      const url = API_URL ? `${API_URL}/api/cursos` : "/api/cursos";
      const res = await fetch(url);

      if (!res.ok) throw new Error("Erro ao buscar dados");
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error(error);
      message.error("Erro ao carregar cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Lógica de Preview de Imagem Local
  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      if (!editingId) setPreviewImage(null);
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (item: CursoCard) => {
    setEditingId(item.id);
    setTitulo(item.titulo);
    setLink(item.link);
    setFileList([]);
    setPreviewImage(getFullImageUrl(item.imagemUrl));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitulo("");
    setLink("");
    setFileList([]);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    if (!titulo || !link) {
      return message.warning("Título e Link são obrigatórios.");
    }

    if (!editingId && fileList.length === 0) {
      return message.warning("A imagem é obrigatória para novos cursos.");
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Você precisa estar logado.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("link", link);
    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    }

    setSubmitting(true);
    try {
      const baseUrl = API_URL || "";
      let url = `${baseUrl}/api/cursos`;
      let method = "POST";

      if (editingId) {
        url = `${baseUrl}/api/cursos/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao salvar");
      }

      message.success(
        editingId ? "Curso atualizado com sucesso!" : "Novo Curso criado!",
      );
      cancelEdit();
      fetchCards();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Deletar usando ID
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    try {
      const baseUrl = API_URL || "";
      const res = await fetch(`${baseUrl}/api/cursos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      message.success("Curso removido.");
      fetchCards();
    } catch (error) {
      message.error("Erro ao excluir curso.");
    }
  };

  // Filtragem local para a busca
  const filteredCards = cards.filter((card) =>
    card.titulo?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              shape="circle"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              className="border-none shadow-none hover:bg-gray-100"
            />
            <div>
              <Title level={4} style={{ margin: 0 }} className="text-gray-800">
                Gerenciar{" "}
                <span className="bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent font-bold">
                  Cursos & Capacitações
                </span>
              </Title>
              <Text type="secondary" className="text-xs">
                Administração do Espaço MEI
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card
              title={
                <div className="flex items-center gap-2">
                  {editingId ? (
                    <EditOutlined className="text-blue-500" />
                  ) : (
                    <PlusOutlined className="text-[#017DB9]" />
                  )}
                  <span>{editingId ? `Editar Curso` : "Novo Curso"}</span>
                </div>
              }
              className={`shadow-md border-t-4 sticky top-24 ${
                editingId ? "border-t-blue-500" : "border-t-[#017DB9]"
              }`}
              extra={
                editingId && (
                  <Button
                    size="small"
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </Button>
                )
              }
            >
              <div className="flex flex-col gap-5">
                {/* Preview da Imagem */}
                <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300 relative aspect-[4/3]">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <PictureOutlined style={{ fontSize: 32 }} />
                      <p className="text-xs mt-2">Nenhuma imagem</p>
                    </div>
                  )}
                </div>

                <div>
                  <Text strong className="mb-1 block text-gray-700">
                    Título do Curso
                  </Text>
                  <Input
                    placeholder="Ex: Como Formalizar seu Negócio"
                    size="large"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    prefix={<span className="text-gray-400 font-bold">T</span>}
                  />
                </div>

                <div>
                  <Text strong className="mb-1 block text-gray-700">
                    Link de Destino
                  </Text>
                  <Input
                    placeholder="https://sebrae.com.br/..."
                    size="large"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    prefix={<LinkOutlined className="text-gray-400" />}
                  />
                </div>

                <div>
                  <Text strong className="mb-1 block text-gray-700">
                    {editingId ? "Alterar Imagem (Opcional)" : "Upload da Capa"}
                  </Text>
                  <Upload
                    listType="picture"
                    maxCount={1}
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
                    className="w-full"
                    accept="image/png, image/jpeg, image/jpg image/webp"
                  >
                    <Button icon={<UploadOutlined />} block size="large">
                      Selecionar Arquivo
                    </Button>
                  </Upload>
                </div>

                <Divider className="my-2" />

                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={submitting}
                  block
                  size="large"
                  className={`font-semibold h-12 shadow-lg transition-all ${
                    editingId
                      ? "bg-blue-600 hover:bg-blue-500 hover:scale-[1.02]"
                      : "bg-[#017DB9] hover:bg-[#016595] hover:scale-[1.02]"
                  }`}
                >
                  {editingId ? "Salvar Alterações" : "Cadastrar Curso"}
                </Button>
              </div>
            </Card>
          </div>

          {/* --- COLUNA DIREITA: LISTA (lg:col-span-8) --- */}
          <div className="lg:col-span-8">
            <Card
              className="shadow-sm border-gray-200"
              title={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                  <span className="text-lg">
                    Cursos Ativos ({filteredCards.length})
                  </span>
                  <Input
                    placeholder="Buscar por título..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="w-full sm:w-64"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </div>
              }
            >
              {loading ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <Spin size="large" />
                  <p className="mt-4 text-gray-500">Carregando dados...</p>
                </div>
              ) : filteredCards.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Nenhum curso encontrado"
                  className="py-10"
                />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={filteredCards}
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 5,
                    align: "center",
                    position: "bottom",
                    showSizeChanger: false,
                    className: "mt-6",
                  }}
                  renderItem={(item) => (
                    <List.Item
                      className={`hover:bg-gray-50 transition-colors px-4 rounded-lg mb-2 border border-transparent hover:border-gray-200 ${
                        editingId === item.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                      actions={[
                        <Tooltip title="Editar informações" key="edit-tooltip">
                          <Button
                            key="edit"
                            type="text"
                            shape="circle"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:bg-blue-100"
                            onClick={() => handleEdit(item)}
                          />
                        </Tooltip>,
                        <Tooltip
                          title="Excluir permanentemente"
                          key="delete-tooltip"
                        >
                          <Popconfirm
                            title="Excluir Curso"
                            description={
                              <div className="max-w-xs">
                                Tem certeza que deseja excluir{" "}
                                <b>{item.titulo}</b>?
                                <br />
                                Esta ação não pode ser desfeita.
                              </div>
                            }
                            onConfirm={() => handleDelete(item.id)}
                            okText="Sim, Excluir"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                            key="delete"
                          >
                            <Button
                              type="text"
                              shape="circle"
                              danger
                              icon={<DeleteOutlined />}
                              className="hover:bg-red-50"
                            />
                          </Popconfirm>
                        </Tooltip>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="relative w-24 h-16 rounded-md overflow-hidden border border-gray-200 shadow-sm group">
                            <Image
                              src={getFullImageUrl(item.imagemUrl)}
                              alt={item.titulo}
                              fill
                              className="object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                        }
                        title={
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 text-lg">
                              {item.titulo}
                            </span>
                            {editingId === item.id && (
                              <Tag color="processing" icon={<EditOutlined />}>
                                Editando agora
                              </Tag>
                            )}
                          </div>
                        }
                        description={
                          <div className="flex flex-col gap-1">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-500 hover:text-[#017DB9] hover:underline truncate max-w-md flex items-center gap-1 text-sm"
                            >
                              {item.link}
                            </a>
                            <Text type="secondary" className="text-xs">
                              ID: {item.id}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCursos;
