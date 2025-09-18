"use client";

import { useEffect, useState, Suspense, useRef } from "react"; // 1. Importar o useRef
import { useSearchParams } from "next/navigation";
import { confirmAccount } from "@/lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Componente interno para usar o useSearchParams
const ConfirmationContent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Confirmando sua conta, por favor aguarde..."
  );

  // 2. Criar um ref para controlar a execução
  const verificationStarted = useRef(false);

  useEffect(() => {
    // 3. Se a verificação já começou, não fazer mais nada
    if (verificationStarted.current) {
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de confirmação não encontrado na URL.");
      return;
    }

    const verifyToken = async () => {
      // 4. Marcar que a verificação começou
      verificationStarted.current = true;
      try {
        const response = await confirmAccount(token);
        setStatus("success");
        setMessage(
          response.message ||
            "Conta confirmada com sucesso! Você será redirecionado para a página de login em 5 segundos."
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.message ||
            "Ocorreu um erro ao confirmar sua conta. O token pode ser inválido ou ter expirado."
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-12 w-12 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Status da Confirmação
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="mb-6">{renderIcon()}</div>
          <p className="text-gray-600">{message}</p>
          {status === "success" && (
            <Button asChild className="mt-6 rounded-full">
              <Link href="/login">Ir para o Login agora</Link>
            </Button>
          )}
          {status === "error" && (
            <Button asChild className="mt-6 rounded-full">
              <Link href="/cadastro">Tentar novamente</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// O componente principal da página não precisa de alterações
const ConfirmAccountPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
};

export default ConfirmAccountPage;
