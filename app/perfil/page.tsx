"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

export default function PerfilPage() {
  const { user, logout, isLoading } = useAuth();

  // Estados para os campos do formulário
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    // Redireciona para a página de login se o usuário não estiver autenticado
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Função para lidar com o envio das alterações
  const handleSaveChanges = () => {
    // Adicione a lógica para salvar as alterações do usuário aqui
    console.log("Salvando alterações:", {
      email,
      password,
    });
  };

  // Função para lidar com a exclusão da conta
  const handleDeleteAccount = () => {
    // Adicione a lógica para a exclusão da conta aqui
    console.log("Excluindo a conta...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="text-center flex flex-col items-center">
                <Image
                  src="/avatars/default-avatar.png"
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500 object-cover"
                />
                <CardTitle>{user.nomeCompleto}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 justify-center items-center">
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="text-red-700 w-fit rounded-xl transition-transform transform hover:scale-105 active:scale-95 border border-transparent hover:border-red-700 "
                >
                  Sair
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Altere suas informações pessoais e de segurança.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 rounded-xl px-4 py-1">
                  <div>
                    <Label htmlFor="email">Alterar E-mail</Label>
                    <Input
                      id="email"
                      placeholder="Deixe em branco para não alterar"
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 rounded-xl border-gray-300 placeholder-gray-300 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Deixe em branco para não alterar"
                      className="mt-1 rounded-xl border-gray-300 placeholder-gray-300 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 rounded-xl border-gray-300 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={handleSaveChanges}
                  className="w-fit rounded-full bg-gray-800 text-white transition-all transform hover:scale-105 hover:bg-gray-700 active:scale-95"
                >
                  Fazer Alterações
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-red-500 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                <CardDescription>
                  A exclusão da sua conta é uma ação irreversível.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  variant="destructive"
                  className="w-fit rounded-full transition-all transform hover:scale-105  active:scale-95 border border-transparent hover:border-red-700 hover:text-red-700"
                  onClick={handleDeleteAccount}
                >
                  Excluir conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
