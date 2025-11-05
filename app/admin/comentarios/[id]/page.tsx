"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Button,
  Spin,
  message,
  Modal,
  Typography,
  Tag,
  Empty,
  Avatar,
  Pagination,
  Grid,
} from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  adminGetReviewsByEstablishment,
  adminDeleteReview,
} from "@/lib/api";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { useBreakpoint } = Grid;

const PAGE_SIZE = 5;

// Interfaces (Mantidas)
interface AvaliacaoAdmin {
  avaliacoesId: number;
  comentario: string;
  nota: number;
  usuario: {
    usuarioId: number;
    nomeCompleto: string;
    email: string;
  };
}

interface PageData {
  estabelecimento: {
    id: number;
    nomeFantasia: string;
    categoria: string;
  };
  avaliacoes: AvaliacaoAdmin[];
}

const AdminComentariosDoEstabelecimento: React.FC = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const params = useParams();
  
  // Obtém o ID da URL. Ele é sempre uma string (ou string[]).
  const rawId = params.id;

  const screens = useBreakpoint();

  const fetchData = useCallback(async () => {
    // 1. VALIDAÇÃO E CONVERSÃO DO ID: Ponto principal da correção.
    if (!rawId || Array.isArray(rawId)) {
        setLoading(false);
        // Evita a chamada de API se o ID for inválido
        // message.error("ID do estabelecimento inválido na URL.");
        // router.push('/admin/comentarios'); 
        return;
    }
    
    const numericId = parseInt(rawId, 10);
    if (isNaN(numericId) || numericId <= 0) {
      setLoading(false);
      message.error("ID do estabelecimento inválido. Redirecionando...");
      router.push('/admin/comentarios');
      return;
    }
    
    // Usamos a string numérica validada
    const estabelecimentoId = numericId.toString();

    // FIM DA CORREÇÃO CRÍTICA

    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado. Faça login novamente.");
      router.push("/admin/login");
      return;
    }

    try {
      // Chama a API com o ID VALIDADO
      const data = await adminGetReviewsByEstablishment(
        estabelecimentoId,
        token
      );
      setPageData(data);
      setCurrentPage(1);
    } catch (error: any) {
      const msg = error.message.includes('404') 
          ? 'Estabelecimento não encontrado ou erro na API.' 
          : error.message || "Falha ao buscar comentários.";
      message.error(msg);
      setPageData(null);
    } finally {
      setLoading(false);
    }
  }, [rawId, router]); // Dependência em rawId

  useEffect(() => {
    // Garante que o fetch só ocorra se o rawId estiver disponível
    if (rawId && !Array.isArray(rawId)) {
      fetchData();
    }
  }, [fetchData, rawId]);

  // A função handleDelete (excluir) não precisa de alteração
  const handleDelete = (id: number) => {
    confirm({
      title: "Você tem certeza que quer excluir este comentário?",
      content: "Esta ação não pode ser desfeita.",
      okText: "Sim, excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        setIsActionLoading(true);
        const token = localStorage.getItem("admin_token");
        if (!token) {
          message.error("Sessão expirada.");
          setIsActionLoading(false);
          return;
        }

        try {
          await adminDeleteReview(id, token);
          message.success("Comentário excluído com sucesso!");
          fetchData(); 
        } catch (error: any) {
          message.error(error.message || "Falha ao excluir comentário.");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };
  
  // Resto do componente (JSX e lógica de renderização) permanece o mesmo
  
  const pageTitle = pageData?.estabelecimento?.nomeFantasia
    ? `Comentários de: ${pageData.estabelecimento.nomeFantasia}`
    : "Carregando comentários...";

  const allAvaliacoes = pageData?.avaliacoes || [];
  const totalCount = allAvaliacoes.length;
  const paginatedAvaliacoes = allAvaliacoes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const isMobile = !screens.md;

  // A parte JSX é mantida
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        {/* Bloco Título + Tag */}
        <div>
          <Title level={isMobile ? 3 : 2} className="m-0" ellipsis>
            {pageTitle}
          </Title>
          {pageData?.estabelecimento?.categoria && (
            <Tag
              color="blue"
              className="mt-2"
              style={{ fontSize: "14px", padding: "5px 10px" }}
            >
              Categoria: {pageData.estabelecimento.categoria}
            </Tag>
          )}
        </div>

        {/* Botão Voltar */}
        <Link href="/admin/comentarios" passHref>
          <Button
            icon={<ArrowLeftOutlined />}
            size={isMobile ? "middle" : "large"}
            className={isMobile ? "w-full" : ""}
          >
            Voltar para Estabelecimentos
          </Button>
        </Link>
      </div>

      <Spin spinning={loading}>
        <List
          className="bg-white p-4 md:p-6 rounded-lg shadow-sm"
          itemLayout="vertical"
          dataSource={paginatedAvaliacoes}
          locale={{
            emptyText: (
              <Empty description="Nenhum comentário encontrado para este estabelecimento." />
            ),
          }}
          renderItem={(item: AvaliacaoAdmin) => (
            <List.Item
              key={item.avaliacoesId}
              actions={[
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.avaliacoesId)}
                  loading={isActionLoading}
                >
                  {isMobile ? null : "Excluir"}
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={"/avatars/default-avatar.png"} />}
                title={
                  <div className="flex flex-wrap items-center gap-2">
                    <Text strong>{item.usuario.nomeCompleto}</Text>
                    <Tag
                      color={
                        item.nota < 3 ? "red" : item.nota > 3 ? "green" : "blue"
                      }
                    >
                      {item.nota} estrela(s)
                    </Tag>
                  </div>
                }
                description={<Text type="secondary">{item.usuario.email}</Text>}
              />
              <div className="mt-3 pl-2 text-base">
                {item.comentario || (
                  <Text type="secondary">(Sem comentário)</Text>
                )}
              </div>
            </List.Item>
          )}
        />

        {totalCount > PAGE_SIZE && (
          <div className="mt-6 text-center">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              simple={isMobile}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default AdminComentariosDoEstabelecimento;