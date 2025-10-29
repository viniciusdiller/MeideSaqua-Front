"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Spin,
  Alert,
  message,
  Typography,
} from "antd";
import { adminUpdateEstablishment } from "@/lib/api";
import { Estabelecimento } from "@/types/Interface-Estabelecimento";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// --- DADOS COMPLETOS DO PROJETO ---

// 1. Categorias (de app/cadastro-mei/page.tsx)
const categorias = [
  "Artesanato e Criação Manual",
  "Beleza, Moda e Estética",
  "Comércio Local e Vendas",
  "Construção, Reforma e Manutenção",
  "Festas e Eventos",
  "Gastronomia e Alimentação",
  "Saúde, Bem-estar e Fitness",
  "Serviços Administrativos e Apoio",
  "Serviços Automotivos e Reparos",
  "Tecnologia e Serviços Digitais",
  "Turismo, Cultura e Lazer",
  "Produtores Rurais e Atividades Agrícolas",
];

// 2. Áreas de Atuação (de app/cadastro-mei/page.tsx)
const areasAtuacao = [
  "Entrega",
  "Retirada",
  "Entrega e Retirada",
  "Água Branca",
  "Alvorada",
  "Areal",
  "Asfalto Velho",
  "Aterrado",
  "Bacaxá",
  "Barra Nova",
  "Barreira",
  "Basiléa",
  "Bicuíba",
  "Bonsucesso",
  "Boqueirão",
  "Caixa d'Água",
  "Centro (Saquarema)",
  "Condado de Bacaxá",
  "Coqueiral",
  "Bairro de Fátima",
  "Engenho Grande",
  "Gravatá",
  "Guarani",
  "Ipitangas",
  "Itaúna",
  "Jaconé",
  "Jardim",
  "Jardim Ipitangas",
  "Leigos",
  "Madressilva",
  "Mombaça",
  "Morro dos Pregos",
  "Palmital",
  "Parque Marina",
  "Porto da Roça I",
  "Porto da Roça II",
  "Porto Novo",
  "Raia",
  "Retiro",
  "Rio d'Areia",
  "Rio Mole",
  "Sampaio Correia",
  "São Geraldo",
  "Serra de Mato Grosso",
  "Tinguí",
  "Verde Vale",
  "Vilatur",
  "Outro município",
];

// 3. TODAS AS TAGS (de app/cadastro-mei/page.tsx)
const tagsPorCategoria: { [key: string]: string[] } = {
  "Artesanato e Criação Manual": [
    "Feito a Mão", "Peça Única", "Decoração", "Personalizado", "Presentes",
    "Crochê", "Biju", "Cerâmica", "Madeira", "Sustentável", "Bordado", "Macramê",
    "Costura Criativa", "Velas", "Saboaria", "Reciclagem",
  ],
  "Beleza, Moda e Estética": [
    "Manicure", "Cabelo", "Maquiagem", "Roupas", "Acessórios", "Depilação",
    "Massagem", "Estética Facial", "Sobrancelha", "Cosméticos Naturais",
    "Brechó", "Moda Praia", "Unhas", "Skincare", "Barbearia", "Cílios",
  ],
  "Comércio Local e Vendas": [
    "Entrega Rápida", "Loja Online", "Revendedor", "Produtos Importados",
    "Eletrônicos", "Materiais", "Varejo", "Atacado", "Promoção",
    "Frete Grátis", "Bazar", "Papelaria", "Utilidades", "Armarinho",
  ],
  "Construção, Reforma e Manutenção": [
    "Eletricista", "Encanador", "Pintor", "Pedreiro", "Jardinagem",
    "Montador de Móveis", "Reparos", "Orçamento Grátis", "Piso",
    "Reforma de Casa", "Gesso", "Drywall", "Marcenaria", "Serralheria",
    "Ar Condicionado", "Limpeza Pós Obra",
  ],
  "Festas e Eventos": [
    "Decoração", "Buffet", "Fotografia", "Aniversário", "Casamento",
    "Música ao Vivo", "Aluguel de Mesas", "Recreação Infantil",
    "Eventos Corporativos", "Churrasco", "Doces Finos", "Barman", "DJ",
    "Lembrancinhas", "Cerimonial",
  ],
  "Gastronomia e Alimentação": [
    "Bolo", "Doces", "Comida Caseira", "Marmitex", "Delivery", "Salgados",
    "Vegetariano", "Vegano", "Cerveja Artesanal", "Petiscos", "Hamburguer",
    "Pizza", "Fit", "Sem Glúten", "Sem Lactose", "Sushi", "Padaria", ],
  "Saúde, Bem-estar e fitness": [
    "Personal Trainer", "Yoga", "Nutricionista", "Psicólogo", "Fisioterapia",
    "Medicina Natural", "Acupuntura", "Suplementos", "Aulas Online",
    "Espaço Zen", "Massoterapia", "Terapias Alternativas", "Pilates",
    "Cuidador de Idosos", "Doula",
  ],
  "Serviços Administrativos e Apoio": [
    "Contabilidade", "Consultoria", "Secretariado", "Digitalização",
    "Tradução", "Assessoria", "Finanças", "Currículo", "Escrita",
    "Organização", "RH", "Suporte", "MEI", "Imposto de Renda",
  ],
  "Serviços Automotivos e Reparos": [
    "Mecânica", "Elétrica", "Borracharia", "Lava Jato", "Funilaria",
    "Guincho", "Revisão", "Pneu", "Motores", "Acessórios Automotivos",
    "Troca de Óleo", "Motos", "Estética Automotiva",
  ],
  "Tecnologia e Serviços Digitais": [
    "Web Design", "Marketing Digital", "Redes Sociais", "Programação",
    "Manutenção PC", "Hospedagem", "Apps", "Consultoria TI", "SEO",
    "Criação de Vídeos", "Suporte Técnico", "Design Gráfico",
    "Tráfego Pago", "Edição de Fotos",
  ],
  "Turismo, Cultura e Lazer": [
    "Guia Turístico", "Passeios", "Praia", "Hospedagem", "Aluguel de Bike",
    "Artesanato Local", "Aulas de Surf", "Trilhas", "Pousada", "Viagens",
    "Translado", "City Tour", "Ecoturismo", "Passeio de Barco",
  ],
  "Produtores Rurais e Atividades Agrícolas": [
    "Produtos Orgânicos", "Horta", "Feira Livre", "Frutas", "Vegetais",
    "Mel", "Gado", "Plantas Ornamentais", "Leite Fresco", "Ovos Caipiras",
    "Queijos", "Agrofloresta", "Sementes", "Pesca Artesanal",
  ],
};

// Gera uma lista única com todas as tags de todas as categorias
const todasTags = [...new Set(Object.values(tagsPorCategoria).flat())];

// --- INTERFACE DO MODAL ---

interface AdminEstabelecimentoModalProps {
  estabelecimento: Estabelecimento | null;
  visible: boolean;
  onClose: (shouldRefresh: boolean) => void;
  mode: "edit-and-approve" | "edit-only";
  onEditAndApprove?: (values: any) => Promise<void>; // Opcional, usado apenas pelo Dashboard
}

// --- COMPONENTE DO MODAL ---

const AdminEstabelecimentoModal: React.FC<AdminEstabelecimentoModalProps> = ({
  estabelecimento,
  visible,
  onClose,
  mode,
  onEditAndApprove,
}) => {
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Preenche o formulário quando o estabelecimento selecionado muda
  useEffect(() => {
    if (estabelecimento && visible) {
      let dataToEdit: any = { ...estabelecimento };

      // Se for um item de atualização, mescla os dados propostos
      if (
        estabelecimento.status === "pendente_atualizacao" &&
        estabelecimento.dados_atualizacao
      ) {
        dataToEdit = { ...estabelecimento, ...estabelecimento.dados_atualizacao };
      }

      // Converte strings separadas por vírgula em arrays para os Selects
      if (typeof dataToEdit.tagsInvisiveis === "string") {
        dataToEdit.tagsInvisiveis = dataToEdit.tagsInvisiveis
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean); // Remove vazios
      }
      if (typeof dataToEdit.areasAtuacao === "string") {
        dataToEdit.areasAtuacao = dataToEdit.areasAtuacao
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean); // Remove vazios
      }
      
      // Mapeia os nomes do backend para os nomes do formulário
      dataToEdit.nome_responsavel = dataToEdit.nomeResponsavel;
      dataToEdit.cpf_responsavel = dataToEdit.cpfResponsavel;

      editForm.setFieldsValue(dataToEdit);
      setCurrentCategory(dataToEdit.categoria); // Armazena a categoria atual
    } else {
      editForm.resetFields();
      setCurrentCategory(null);
    }
  }, [estabelecimento, visible, editForm]);

  const handleSubmit = async (values: any) => {
    if (!estabelecimento) return;

    setIsEditLoading(true);

    // Converte arrays de volta para strings
    if (Array.isArray(values.tagsInvisiveis)) {
      values.tagsInvisiveis = values.tagsInvisiveis.join(", ");
    }
    if (Array.isArray(values.areasAtuacao)) {
      values.areasAtuacao = values.areasAtuacao.join(", ");
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        message.error("Autenticação expirada.");
        setIsEditLoading(false);
        return;
      }

      if (mode === "edit-and-approve" && onEditAndApprove) {
        // Lógica do Dashboard: Envia JSON para o endpoint 'edit-and-approve'
        await onEditAndApprove(values);
        message.success("Estabelecimento editado e aprovado!");

      } else {
        // Lógica de 'estabelecimentos-ativos': Envia FormData para 'solicitar-atualizacao'
        
        const formData = new FormData();

        // 1. Adiciona todos os valores do formulário
        Object.keys(values).forEach(key => {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        });

        // 2. Garante campos de identificação para o endpoint 'solicitar-atualizacao'
        formData.append('cnpj', estabelecimento.cnpj);
        formData.append('nome_responsavel', values.nome_responsavel || estabelecimento.nomeResponsavel);
        formData.append('cpf_responsavel', values.cpf_responsavel || estabelecimento.cpfResponsavel);
        formData.append('emailEstabelecimento', values.emailEstabelecimento || estabelecimento.emailEstabelecimento);

        // 3. Chama a API de 'lib/api.ts'
        await adminUpdateEstablishment(estabelecimento.estabelecimentoId, formData, token);
        message.success("Solicitação de atualização enviada com sucesso!");
      }

      onClose(true); // Fecha o modal e sinaliza para recarregar os dados
    } catch (error: any) {
      message.error(error.message || "Falha ao salvar.");
    } finally {
      setIsEditLoading(false);
    }
  };
  
  // Define a lista de tags com base na categoria selecionada no formulário
  const tagsSugeridas = currentCategory ? (tagsPorCategoria[currentCategory] || []) : todasTags;


  return (
    <Modal
      title={
        mode === "edit-and-approve"
          ? "Editar e Aprovar Estabelecimento"
          : "Editar Estabelecimento (Solicitar Atualização)"
      }
      open={visible}
      onCancel={() => onClose(false)}
      width={900}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isEditLoading}
          onClick={() => editForm.submit()}
        >
          {mode === "edit-and-approve" ? "Salvar e Aprovar" : "Enviar Atualização"}
        </Button>,
      ]}
    >
      <Form
        form={editForm}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        onValuesChange={(changedValues) => {
          // Atualiza as tags sugeridas se a categoria mudar
          if (changedValues.categoria) {
            setCurrentCategory(changedValues.categoria);
          }
        }}
      >
        <Spin spinning={isEditLoading}>
          
          <Title level={5} className="mt-4">
            Informações do Negócio
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nomeFantasia"
                label="Nome Fantasia"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoria"
                label="Categoria Principal"
                rules={[{ required: true }]}
              >
                <Select placeholder="Selecione a categoria">
                  {categorias.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cnpj"
                label="CNPJ"
                rules={[{ required: true }]}
              >
                <Input disabled={mode === 'edit-only'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cnae"
                label="CNAE"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="mt-4">
            Informações do Responsável
          </Title>
           <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nome_responsavel"
                label="Nome do Responsável"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cpf_responsavel"
                label="CPF do Responsável"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="mt-4">
            Contato e Links
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emailEstabelecimento"
                label="Email de Contato"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contatoEstabelecimento"
                label="Telefone / WhatsApp"
                 rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="website"
                label="Website"
                rules={[{ type: "url" }]}
              >
                <Input placeholder="http://..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="instagram"
                label="Instagram"
                rules={[{ type: "url" }]}
              >
                <Input placeholder="http://instagram.com/..." />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="endereco" label="Endereço">
            <Input />
          </Form.Item>

          <Title level={5} className="mt-4">
            Detalhes e Busca
          </Title>
          <Form.Item
            name="descricaoDiferencial"
            label="Diferencial (Descrição Curta)"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="descricao"
            label="Descrição Completa"
            rules={[{ required: true }]}
          >
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="areasAtuacao" label="Áreas de Atuação">
            <Select mode="multiple" placeholder="Selecione os bairros de atuação">
              {areasAtuacao.map((area) => (
                  <Option key={area} value={area}>
                    {area}
                  </Option>
                ))}
            </Select>
          </Form.Item>
           <Form.Item 
             name="tagsInvisiveis" 
             label="Tags de Busca"
             rules={[
                {
                  validator: (_, value) =>
                    value && value.length > 5
                      ? Promise.reject(new Error("Selecione no máximo 5 tags!"))
                      : Promise.resolve(),
                },
             ]}
           >
            <Select 
              mode="tags" 
              placeholder="Insira ou selecione até 5 tags"
              maxTagCount={5}
            >
              {tagsSugeridas.map((tag) => (
                  <Option key={tag} value={tag}>
                    {tag}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Alert
            message="Aviso sobre Arquivos"
            description="A 'Nova Logo', 'Novo CCMEI' e 'Novas Imagens de Portfólio' enviadas pelo usuário (visíveis na tela anterior, se houver) serão aprovadas ou processadas automaticamente junto com estas edições. Não é possível adicionar novos arquivos nesta tela de edição de texto."
            type="warning"
            showIcon
            className="mt-4"
          />
        </Spin>
      </Form>
    </Modal>
  );
};

export default AdminEstabelecimentoModal;