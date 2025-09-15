// app/confirmar-novo-email/page.tsx

"use client";

// 1. Importe o 'useRef' do React
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { confirmEmailChange } from "@/lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ConfirmationContent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Confirmando sua alteração de e-mail, por favor aguarde..."
  );

  // 2. Crie uma referência para controlar a execução
  const verificationStarted = useRef(false);

  useEffect(() => {
    // 3. Se a verificação já foi disparada, não faz mais nada.
    //    Isso previne a dupla execução.
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
      // 4. Marca que a verificação começou.
      //    O valor de `useRef` persiste entre as renderizações.
      verificationStarted.current = true;
      try {
        await confirmEmailChange(token);
        setStatus("success");
        setMessage(
          "Seu e-mail foi alterado com sucesso! Você será redirecionado para a página de login."
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.message ||
            "Ocorreu um erro ao confirmar sua alteração. O token pode ser inválido ou ter expirado."
        );
      }
    };

    verifyToken();
  }, [searchParams]); // Remova 'status' do array de dependências

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
            Confirmação de E-mail
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="mb-6">{renderIcon()}</div>
          <p className="text-gray-600">{message}</p>
          {status === "success" && (
            <Button asChild className="mt-6 rounded-full">
              <Link href="/login">Ir para o Login</Link>
            </Button>
          )}
          {status === "error" && (
            <Button asChild className="mt-6 rounded-full">
              <Link href="/perfil">Voltar ao Perfil</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// O restante do arquivo permanece o mesmo
const ConfirmarNovoEmailPage = () => {
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

export default ConfirmarNovoEmailPage;
