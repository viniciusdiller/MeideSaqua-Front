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
  Grid,
  Pagination,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import {
  getAllActiveEstablishments, // 1. Usamos a função de Estabelecimento já existente
} from "@/lib/api";
// NOTE: Você precisará garantir que esta interface exista ou adaptar a existente
// Ex: Seus arquivos sugerem 'types/Interface-Estabelecimento.tsx'
import { Estabelecimento } from "@/types/Interface-Estabelecimento"; 

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

// Se a interface 'Estabelecimento' não for definida, use esta estrutura de exemplo:
/*
interface Estabelecimento {
  id: number;
  nomeFantasia: string;
  categoria: string; // Corresponde ao 'ods' no modelo Projeto
  endereco: string; 
  logoUrl: string; // Ou 'logo_url' dependendo do seu backend
  cnpj: string; 
  // ... outras propriedades de Estabelecimento
}
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 6;

// Função adaptada para buscar imagens de estabelecimentos
const getFullImageUrl = (path: string | undefined): string => {
  if (!path) return "";
  const normalizedPath = path.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.substring(1)
    : normalizedPath;
  return `${API_URL}/${cleanPath}`;
};

// 2. Renomeamos o componente para Estabelecimento
const AdminComentariosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>(
    []
  );
  const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState<
    Estabelecimento[]
  >([]);
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
      // 3. Chamada de API para Estabelecimentos ativos
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

  // Lógica de busca adaptada para Estabelecimentos
  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = estabelecimentos.filter(
      (e) =>
        // 4. Busca por nomeFantasia e Categoria
        e.nomeFantasia.toLowerCase().includes(lowerCaseValue) ||
        (e.categoria && e.categoria.toLowerCase().includes(lowerCaseValue))
    );
    setFilteredEstabelecimentos(filtered);
    setCurrentPage(1);
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Lógica de agrupar estabelecimentos por Categoria (antigo ODS)
  const groupedEstabelecimentos = filteredEstabelecimentos.reduce(
    (acc, estabelecimento) => {
      // 5. Usa 'categoria' como chave de agrupamento
      const categoriaKey = estabelecimento.categoria || "Sem Categoria";
      
      // Remove o prefixo ODS se não for usado no modelo de estabelecimento.
      // Vou simplificar, mas você pode ajustar se suas categorias tiverem prefixo.
      const categoria = categoriaKey || "Sem Categoria"; 

      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(estabelecimento);
      
      return acc;
    },
    {} as { [key: string]: Estabelecimento[] }
  );

  // Lógica de ordenar categorias (Adaptada para ordenar alfabeticamente)
  const sortedCategories = Object.keys(groupedEstabelecimentos).sort((a, b) => {
    if (a === "Sem Categoria") return 1; // Joga "Sem Categoria" para o final
    if (b === "Sem Categoria") return -1;
    // Ordena as categorias alfabeticamente
    return a.localeCompare(b);
  });

  const tabPosition = screens.md ? "left" : "top";

  return (
    <div className="p-4 md:p-8">
      <Link href="/admin/dashboard" passHref>
        <Button icon={<ArrowLeftOutlined />} type="text" className="mb-4">
          Voltar ao Dashboard
        </Button>
      </Link>

      {/* 6. Título da página atualizado */}
      <Title level={2} className="mb-6">
        Gerenciar Comentários por Estabelecimento ({filteredEstabelecimentos.length})
      </Title>

      <Search
        placeholder="Buscar por nome fantasia ou categoria..."
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        enterButton
        size="large"
        className="mb-6"
      />

      <Spin spinning={loading}>
        {filteredEstabelecimentos.length === 0 && !loading ? (
          // 7. Mensagem de vazio atualizada
          <Empty description="Nenhum estabelecimento ativo encontrado." />
        ) : (
          <Tabs
            defaultActiveKey={sortedCategories[0]}
            tabPosition={tabPosition}
            onChange={handleTabChange}
          >
            {sortedCategories.map((categoria) => {
              const allEstabelecimentosForCategoria = groupedEstabelecimentos[categoria];
              const totalCount = allEstabelecimentosForCategoria.length;
              const estabelecimentosToShow = allEstabelecimentosForCategoria.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
              );

              return (
                // 8. Aba usando 'categoria'
                <TabPane tab={`${categoria} (${allEstabelecimentosForCategoria.length})`} key={categoria}>
                  <Row gutter={[16, 16]}>
                    {estabelecimentosToShow.map(
                      (
                        estabelecimento // Mapeia apenas 'estabelecimentosToShow'
                      ) => (
                        <Col xs={24} md={12} lg={8} key={estabelecimento.id}>
                          <Card
                            hoverable
                            // 9. Ações do Card: Link para a página de comentários
                            actions={[
                              <Link
                                // Assume que o ID do estabelecimento é 'id'
                                href={`/admin/comentarios/${estabelecimento.id}`} 
                                passHref
                                key="comentarios"
                              >
                                <Button
                                  type="text"
                                  icon={<CommentOutlined />}
                                  className="hover:!bg-blue-500 hover:!text-white"
                                >
                                  Ver Comentários
                                </Button>
                              </Link>,
                            ]}
                          >
                            <Card.Meta
                              avatar={
                                <Avatar
                                  // 10. Assume que a propriedade da logo é 'logoUrl'
                                  src={getFullImageUrl(estabelecimento.logoUrl || "")}
                                />
                              }
                              // 11. Título e Descrição adaptados para Estabelecimento
                              title={estabelecimento.nomeFantasia}
                              description={
                                <>
                                  <Text>Categoria: {estabelecimento.categoria}</Text>
                                  <br />
                                  <Text>CNPJ: {estabelecimento.cnpj || "N/A"}</Text> 
                                </>
                              }
                            />
                          </Card>
                        </Col>
                      )
                    )}
                  </Row>

                  {/* Lógica de paginação (sem mudanças) */}
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
    </div>
  );
};

export default AdminComentariosPage;