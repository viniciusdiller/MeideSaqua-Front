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
  Grid, // 1. IMPORTADO DO NOVO CÓDIGO
} from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
// 2. FUNÇÕES ADAPTADAS PARA O API.TS DO MEIDESAQUÁ
import {
  adminGetReviewsByEstablishment,
  adminDeleteReview,
} from "@/lib/api";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { useBreakpoint } = Grid; // 3. HOOK DE BREAKPOINT MANTIDO

const PAGE_SIZE = 5;

// Interface para a Avaliação (do seu novo código)
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

// 4. INTERFACE ADAPTADA PARA "ESTABELECIMENTO"
interface PageData {
  estabelecimento: {
    estabelecimentoId: number;
    nomeEstabelecimento: string;
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
  
  // 5. VARIÁVEL RENOMEADA PARA CLAREZA
  const estabelecimentoId = params.id as string;

  const screens = useBreakpoint(); // 6. HOOK DE RESPONSIVIDADE MANTIDO

  const fetchData = useCallback(async () => {
    // 7. LÓGICA ATUALIZADA
    if (!estabelecimentoId) return;

    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado. Faça login novamente.");
      router.push("/admin/login");
      return;
    }

    try {
      // 8. CHAMADA DE API CORRETA DO MEIDESAQUÁ
      const data = await adminGetReviewsByEstablishment(estabelecimentoId, token);
      setPageData(data);
      setCurrentPage(1);
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar comentários.");
    } finally {
      setLoading(false);
    }
    // 9. DEPENDÊNCIA ATUALIZADA
  }, [estabelecimentoId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // A função handleDelete é idêntica e foi mantida
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
          // 10. CHAMADA DE API CORRETA DO MEIDESAQUÁ
          await adminDeleteReview(id, token);
          message.success("Comentário excluído com sucesso!");
          fetchData(); // Recarrega os dados
        } catch (error: any) {
          message.error(error.message || "Falha ao excluir comentário.");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  // 11. TÍTULO DA PÁGINA ATUALIZADO
  const pageTitle = pageData?.estabelecimento?.nomeEstabelecimento
    ? `Comentários de: ${pageData.estabelecimento.nomeEstabelecimento}`
    : "Carregando comentários...";

  // Lógica de paginação (mantida)
  const allAvaliacoes = pageData?.avaliacoes || [];
  const totalCount = allAvaliacoes.length;
  const paginatedAvaliacoes = allAvaliacoes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 12. LÓGICA DE RESPONSIVIDADE MANTIDA
  const isMobile = !screens.md;

  return (
    // 13. PADDING RESPONSIVO MANTIDO
    <div className="p-4 md:p-8">
      {/* 14. CABEÇALHO RESPONSIVO MANTIDO */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        {/* Bloco Título + Tag */}
        <div>
          <Title level={isMobile ? 3 : 2} className="m-0" ellipsis>
            {pageTitle}
          </Title>
          {/* 15. TAG ATUALIZADA */}
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

        {/* Bloco Botão Voltar */}
        <Link href="/admin/comentarios" passHref>
          <Button
            icon={<ArrowLeftOutlined />}
            size={isMobile ? "middle" : "large"}
            // 16. BOTÃO RESPONSIVO MANTIDO
            className={isMobile ? "w-full" : ""}
          >
            {/* 17. TEXTO ATUALIZADO */}
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
              // 18. TEXTO ATUALIZADO
              <Empty description="Nenhum comentário encontrado para este estabelecimento." />
            ),
          }}
          renderItem={(item: AvaliacaoAdmin) => (
            <List.Item
              key={item.avaliacoesId}
              actions={[
                // 19. BOTÃO DE EXCLUIR RESPONSIVO MANTIDO
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.avaliacoesId)}
                  loading={isActionLoading}
                >
                  {/* O texto "Excluir" some em telas pequenas */}
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
            {/* 20. PAGINAÇÃO RESPONSIVA MANTIDA */}
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              // Usa o modo "simple" em telas pequenas
              simple={isMobile}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default AdminComentariosDoEstabelecimento;