"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Home,
  Globe,
  MousePointerClick,
  Users,
  ShoppingCart,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAdminStats } from "@/lib/api";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { toast } from "@/hooks/use-toast"; // Descomente se for usar

// --- CONFIGURAÇÕES VISUAIS ---

// Cores para categorias
const CATEGORY_COLORS: { [key: string]: string } = {
  Alimentação: "#E5243B",
  Saúde: "#4C9F38",
  Construção: "#FD6925",
  Turismo: "#26BDE2",
  Artesanato: "#DDA63A",
  Serviços: "#00689D",
  Moda: "#FF3A21",
  Tecnologia: "#19486A",
  Festas: "#C5192D",
};

const getCategoryColor = (categoryName: string) => {
  return CATEGORY_COLORS[categoryName] || "#8884d8";
};

// Estilo do cursor ao passar o mouse (hover)
const hoverCursorColor = { fill: "#d1d5db", opacity: 0.15 };

// Configurações dos Gráficos (Labels)
const configMeis = {
  qtd: { label: "MEIs", color: "#3C6AB2" },
} satisfies ChartConfig;

const configViews = {
  views: { label: "Acessos", color: "#8884d8" },
} satisfies ChartConfig;

const configNotas = {
  qtd: { label: "Avaliações", color: "#00AEEF" },
} satisfies ChartConfig;

const configEscalaNegocio = {
  value: { label: "Qtd.", color: "#FDB713" },
} satisfies ChartConfig;

const configVendas = {
  qtd: { label: "Qtd.", color: "#10B981" },
} satisfies ChartConfig;

const configCursos = {
  qtd: { label: "Cliques", color: "#F59E0B" },
} satisfies ChartConfig;

export default function AdminIndicadoresPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.push("/admin/login");
        return;
      }
      try {
        const stats = await getAdminStats(token);
        setData(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const SummaryCard = ({
    title,
    value,
    icon: Icon,
    colorBg,
    colorText,
    suffix,
  }: any) => (
    <Card
      className="border-none shadow-sm h-full"
      style={{ background: colorBg }}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p
            className="font-medium uppercase text-xs tracking-wider mb-1"
            style={{ color: colorText, opacity: 0.8 }}
          >
            {title}
          </p>
          <div className="flex items-baseline">
            <span
              className="text-3xl font-extrabold"
              style={{ color: colorText }}
            >
              {value}
            </span>
            {suffix && (
              <span
                className="text-sm font-semibold ml-2 opacity-70"
                style={{ color: colorText }}
              >
                {suffix}
              </span>
            )}
          </div>
        </div>
        <div
          className="p-3 rounded-full bg-white/30"
          style={{ color: colorText }}
        >
          <Icon size={28} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 min-h-screen bg-[#f4f7fe]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* CABEÇALHO */}
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Painel de Indicadores
            </h1>
            <p className="text-gray-500">
              Visão geral do ecossistema MeiDeSaquá.
            </p>
          </div>
        </div>

        {/* 1. CARDS DE RESUMO GERAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="MEIs Ativos"
            value={data?.totalMeis}
            icon={Lightbulb}
            colorBg="#E6F7FF"
            colorText="#0050B3"
          />
          <SummaryCard
            title="Média Geral de Avaliação"
            value={data?.mediaAvaliacao}
            icon={TrendingUp}
            colorBg="#FFF7E6"
            colorText="#D46B08"
            suffix="/ 5.0"
          />
          <SummaryCard
            title="Total de Comentários"
            value={data?.totalAvaliacoes}
            icon={CheckCircle}
            colorBg="#FFF0F6"
            colorText="#C41D7F"
          />
        </div>

        {/* 2. CARDS DE TRÁFEGO */}
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8">
          Tráfego e Engajamento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Usuários Cadastrados"
            value={data?.totalUsuarios || 0}
            icon={Users}
            colorBg="#F6FFED"
            colorText="#389E0D"
          />
          <SummaryCard
            title="Acessos Home"
            value={data?.pageViews?.home || 0}
            icon={Home}
            colorBg="#E6F7FF"
            colorText="#0050B3"
          />
          <SummaryCard
            title="Acessos Espaço MEI"
            value={data?.pageViews?.espacoMei || 0}
            icon={Globe}
            colorBg="#F0F5FF"
            colorText="#2F54EB"
          />
          <SummaryCard
            title="Acessos em Categorias"
            value={data?.pageViews?.categoriasTotal || 0}
            icon={MousePointerClick}
            colorBg="#FFF2E8"
            colorText="#D4380D"
          />
        </div>

        {/* 3. GRÁFICOS PRINCIPAIS */}
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">
          Análise de Mercado
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OFERTA DE MEIS POR CATEGORIA */}
          <Card className="border border-gray-100 shadow-md bg-white rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="text-blue-600 h-5 w-5" />
                Oferta de MEIs (Por Categoria)
              </CardTitle>
              <CardDescription>
                Quantidade de estabelecimentos ativos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={configMeis} className="h-[300px] w-full">
                <BarChart
                  data={data?.chartMeisPorCategoria}
                  margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="categoria"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#666" }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    tickFormatter={(value) => value.split(" ")[0]} // <--- Mostra só a primeira palavra
                  />
                  <YAxis
                    allowDecimals={false}
                    width={30}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />

                  {/* --- TOOLTIP PERSONALIZADO --- */}
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  {/* ----------------------------- */}

                  <Bar dataKey="qtd" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="qtd"
                      position="top"
                      style={{ fill: "#666", fontSize: 12, fontWeight: "bold" }}
                    />
                    {data?.chartMeisPorCategoria?.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getCategoryColor(entry.categoria)}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* INTERESSE PÚBLICO (VISUALIZAÇÕES) */}
          <Card className="border border-gray-100 shadow-md bg-white rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="text-purple-600 h-5 w-5" />
                Interesse Público (Acessos)
              </CardTitle>
              <CardDescription>
                Categorias mais visitadas pela população.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={configViews} className="h-[300px] w-full">
                <BarChart
                  data={data?.chartVisualizacoesPorCategoria}
                  margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="categoria"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#666" }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis hide />

                  {/* --- TOOLTIP PERSONALIZADO --- */}
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  {/* ----------------------------- */}

                  <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="views"
                      position="top"
                      style={{ fill: "#666", fontSize: 12, fontWeight: "bold" }}
                    />
                    {data?.chartVisualizacoesPorCategoria?.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getCategoryColor(entry.categoria)}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* 4. GRÁFICOS SECUNDÁRIOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DISTRIBUIÇÃO DE NOTAS */}
          <Card className="border border-gray-100 shadow-md bg-white rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="text-blue-500 h-5 w-5" />
                Qualidade (Notas das Avaliações)
              </CardTitle>
              <CardDescription>
                Distribuição das notas dadas pelos usuários.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={configNotas} className="h-[300px] w-full">
                <BarChart
                  data={data?.chartDistribuicaoNotas}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="nota"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    dy={10}
                  />
                  <YAxis hide />

                  {/* --- TOOLTIP PERSONALIZADO --- */}
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line" // Era 'dashed' no outro, mudei para line para padronizar ou mantenha dashed se preferir
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  {/* ----------------------------- */}

                  <Bar
                    dataKey="qtd"
                    fill="var(--color-qtd)"
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList
                      dataKey="qtd"
                      position="top"
                      style={{ fill: "#666", fontSize: 12, fontWeight: "bold" }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* ESCALA DO NEGÓCIO */}
          <Card className="border border-gray-100 shadow-md bg-white rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="text-yellow-500 h-5 w-5" />
                Maturidade (Escala do Negócio)
              </CardTitle>
              <CardDescription>
                Autodeclaração de escala dos MEIs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={configEscalaNegocio}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={data?.chartEscalaNegocio}
                  layout="vertical"
                  margin={{ left: 0, right: 40, top: 10, bottom: 10 }}
                  barSize={24}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <YAxis
                    dataKey="label"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />
                  <XAxis dataKey="value" type="number" hide />

                  {/* --- TOOLTIP PERSONALIZADO --- */}
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  {/* ----------------------------- */}

                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      style={{ fontSize: 12, fontWeight: "bold", fill: "#666" }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* 5. GRÁFICO DE VENDAS (NOVO) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-100 shadow-md bg-white rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="text-emerald-600 h-5 w-5" />
                Canais de Venda e Divulgação
              </CardTitle>
              <CardDescription>
                Como os MEIs comercializam seus produtos/serviços.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={configVendas}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={data?.chartVendas}
                  layout="vertical"
                  margin={{ left: 0, right: 40, top: 10, bottom: 10 }}
                  barSize={24}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <YAxis
                    dataKey="canal"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={130}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />
                  <XAxis dataKey="qtd" type="number" hide />

                  {/* --- TOOLTIP PERSONALIZADO --- */}
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  {/* ----------------------------- */}

                  <Bar
                    dataKey="qtd"
                    fill="var(--color-qtd)"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="qtd"
                      position="right"
                      style={{ fontSize: 12, fontWeight: "bold", fill: "#666" }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="hidden lg:block">
            <Card className="border border-gray-100 shadow-md bg-white rounded-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="text-amber-600 h-5 w-5" />
                  Interesse em Cursos (Espaço MEI)
                </CardTitle>
                <CardDescription>
                  Cursos e capacitações mais clicados pelos usuários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {" "}
                  {/* Espaçamento vertical entre os itens */}
                  {data?.chartCursos?.map((item: any, index: number) => {
                    // Calcula a porcentagem relativa ao curso mais clicado para a barra
                    const maxVal = Math.max(
                      ...data.chartCursos.map((i: any) => i.qtd)
                    );
                    const percent = (item.qtd / maxVal) * 100;

                    return (
                      <div key={index} className="space-y-1">
                        {/* Linha com Nome e Quantidade */}
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className="font-medium text-gray-700 truncate pr-4"
                            title={item.curso}
                          >
                            {item.curso}
                          </span>
                          <span className="font-bold text-gray-900">
                            {item.qtd}
                          </span>
                        </div>

                        {/* Barra de Progresso Customizada */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {(!data?.chartCursos || data.chartCursos.length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhum dado registrado ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
