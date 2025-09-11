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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

export default function PerfilPage() {
  const { user, logout, isLoading } = useAuth();

  // Estados para os campos do formulário de edição
  const [nomeCompleto, setNomeCompleto] = useState(user?.nomeCompleto || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Função para lidar com o envio das alterações
  const handleSaveChanges = () => {
    // Adicione a lógica para salvar as alterações do usuário aqui
    console.log("Salvando alterações:", {
      nomeCompleto,
      username,
      password,
    });
    // Fecha o dialog após salvar
    setIsDialogOpen(false);
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
              <CardContent className="flex flex-col gap-4">
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full rounded-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-transparent hover:border-red-700"
                >
                  Sair
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            {/* Card de Configurações da Conta com Dados Read-Only */}
            <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Visualize suas informações ou clique no botão para editar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentNome">Nome Completo</Label>
                  <Input
                    id="currentNome"
                    value={user.nomeCompleto}
                    readOnly
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="currentEmail">Email</Label>
                  <Input
                    id="currentEmail"
                    value={user.email}
                    readOnly
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="currentUsername">Nome de Usuário</Label>
                  <Input
                    id="currentUsername"
                    value={user.username}
                    readOnly
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-fit rounded-full bg-gray-800 text-white transition-all transform hover:scale-105 hover:bg-gray-700 active:scale-95">
                      Alterar Dados
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                      <DialogDescription>
                        Faça alterações no seu perfil aqui. Clique em salvar
                        quando terminar.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Formulário de Edição Dentro do Modal */}
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="email" className="text-right">
                          Alterar E-mail
                        </Label>
                        <Input
                          id="email"
                          placeholder="Deixe em branco para não alterar"
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 rounded-xl border-gray-300 placeholder-gray-300 transition-all hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-right">
                          Nova Senha
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Deixe em branco para não alterar"
                          className="mt-1 rounded-xl border-gray-300 placeholder-gray-300 transition-all hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-right">
                          Confirmar Nova Senha
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 rounded-xl border-gray-300 transition-all hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose
                        asChild
                        className="rounded-xl border border-gray-300 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200"
                      >
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button
                        onClick={handleSaveChanges}
                        className="rounded-xl border-blue-600 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                      >
                        Salvar Alterações
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            {/* Card de Zona de Perigo */}
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
                  className="w-fit rounded-full transition-all transform hover:scale-105 hover:bg-red-500 active:scale-95 border-2 border-transparent hover:border-red-700"
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
