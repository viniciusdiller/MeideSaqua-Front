"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Select, Spin, Result, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  cadastrarEstabelecimento,
  atualizarEstabelecimento,
  excluirEstabelecimento,
} from "@/lib/api";

import RegisterForm from "@/components/cadastro-mei/RegisterForm";
import UpdateForm from "@/components/cadastro-mei/UpdateForm";
import DeleteForm from "@/components/cadastro-mei/DeleteForm";

type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";

export default function CadastroMEIPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [submittedMessage, setSubmittedMessage] = useState({
    title: "",
    subTitle: "",
  });
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  const processFilesAndSubmit = async (
    values: any,
    files: any,
    apiFn: Function,
  ) => {
    if (!user?.token) return toast.error("Sessão expirada.");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (
          value &&
          !["logo", "ccmeiFile", "portfolio", "produtos"].includes(key)
        ) {
          formData.append(
            key,
            Array.isArray(value) ? value.join(", ") : (value as string),
          );
        }
      });

      if (files.logo?.originFileObj)
        formData.append("logo", files.logo.originFileObj);
      if (files.ccmei?.originFileObj)
        formData.append("ccmei", files.ccmei.originFileObj);
      if (files.portfolio) {
        files.portfolio.forEach((f: any) => {
          if (f.originFileObj) formData.append("produtos", f.originFileObj);
        });
      }

      await apiFn(formData, user.token);
      setFlowStep("submitted");
    } catch (e: any) {
      message.error(e.message || "Erro ao processar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (v: any, f: any) => {
    setSubmittedMessage({
      title: "Cadastro realizado!",
      subTitle: "Seu negócio estará visível em breve.",
    });
    processFilesAndSubmit(v, f, cadastrarEstabelecimento);
  };

  const handleUpdate = (v: any, f: any) => {
    setSubmittedMessage({
      title: "Atualização enviada!",
      subTitle: "Analisaremos as mudanças em breve.",
    });
    processFilesAndSubmit(v, f, atualizarEstabelecimento);
  };

  const handleDelete = (v: any, f: any) => {
    setSubmittedMessage({
      title: "Exclusão solicitada!",
      subTitle: "Seu perfil será removido em breve.",
    });
    processFilesAndSubmit(v, f, excluirEstabelecimento);
  };

  if (isLoading || !user)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-800 py-20 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <Spin spinning={loading}>
          {flowStep !== "initial" && flowStep !== "submitted" && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => setFlowStep("initial")}
              className="mb-6"
            >
              Voltar ao início
            </Button>
          )}

          {flowStep === "initial" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#017DB9] to-[#22c362] bg-clip-text text-transparent">
                PORTAL DO MEI
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Valorize seu talento em Saquarema. Escolha uma opção abaixo:
              </p>
              <Select
                className="w-full"
                size="large"
                placeholder="O que você deseja fazer?"
                onSelect={(v: FlowStep) => {
                  form.resetFields();
                  setFlowStep(v);
                }}
              >
                <Select.Option value="register">
                  Cadastrar meu MEI
                </Select.Option>
                <Select.Option value="update">
                  Atualizar informações
                </Select.Option>
                <Select.Option value="delete">Excluir meu MEI</Select.Option>
              </Select>
            </div>
          )}

          {flowStep === "register" && (
            <RegisterForm
              form={form}
              onFinish={handleRegister}
              loading={loading}
            />
          )}
          {flowStep === "update" && (
            <UpdateForm form={form} onFinish={handleUpdate} loading={loading} />
          )}
          {flowStep === "delete" && (
            <DeleteForm form={form} onFinish={handleDelete} loading={loading} />
          )}

          {flowStep === "submitted" && (
            <Result
              status="success"
              title={submittedMessage.title}
              subTitle={submittedMessage.subTitle}
              extra={
                <Button type="primary" onClick={() => setFlowStep("initial")}>
                  Voltar ao Início
                </Button>
              }
            />
          )}
        </Spin>
      </div>
    </div>
  );
}
