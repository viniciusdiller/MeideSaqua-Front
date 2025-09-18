"use client";

import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Importando o ícone
import {
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { contemPalavrao } from "@/lib/profanityFilter";

export default function PerfilPage() {
  const { user, logout, isLoading, updateUser: updateUserContext } = useAuth();

  // Estados para o formulário de perfil
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // Estado de carregamento

  // Estados para o formulário de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Estado de carregamento

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

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

  const handleProfileUpdate = async () => {
    if (contemPalavrao(username)) {
      toast.error("Você utilizou palavras inapropriadas no nome de usuário.");
      return;
    }
    if (!user?.token) {
      toast.error("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    const profileData = {
      username: username !== user.username ? username : undefined,
      email: email.toLowerCase() !== user.email.toLowerCase() ? email : undefined,
    };

    if (!profileData.username && !profileData.email) {
      toast.info("Nenhuma alteração foi feita.");
      setIsProfileDialogOpen(false);
      return;
    }

    setIsUpdatingProfile(true); // Inicia o carregamento
    try {
      const updatedUser = await updateUserProfile(profileData, user.token);
      updateUserContext(updatedUser);

      if (profileData.email) {
        toast.success(
          "Dados atualizados! Um e-mail de confirmação foi enviado para o seu novo endereço.",
        );
      } else {
        toast.success("Nome de usuário atualizado com sucesso!");
      }
      setIsProfileDialogOpen(false);
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setIsUpdatingProfile(false); // Finaliza o carregamento
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !currentPassword) {
      toast.error("Preencha todos os campos de senha.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As novas senhas não coincidem.");
      return;
    }
    if (!user?.token) {
      toast.error("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    setIsChangingPassword(true); // Inicia o carregamento
    try {
      await changeUserPassword({ currentPassword, newPassword }, user.token);
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast.error(`Erro ao alterar senha: ${error.message}`);
    } finally {
      setIsChangingPassword(false); // Finaliza o carregamento
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.token) {
      toast.error("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    try {
      await deleteUserAccount(user.token);
      toast.success("Conta excluída com sucesso. Você será desconectado.");
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(`Erro ao excluir a conta: ${error.message}`);
    }
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
            {/* Card de Configurações da Conta */}
            <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Altere seu nome de usuário e e-mail.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentUsername">Nome de Usuário</Label>
                  <Input
                    id="currentUsername"
                    value={username}
                    readOnly
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="currentEmail">Email</Label>
                  <Input
                    id="currentEmail"
                    value={email}
                    readOnly
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Dialog
                  open={isProfileDialogOpen}
                  onOpenChange={setIsProfileDialogOpen}
                >
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
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="usernameEdit">Nome de Usuário</Label>
                        <Input
                          id="usernameEdit"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="mt-1 rounded-xl w-full py-2
                          rounded-2xl border border-gray-200 bg-white shadow-sm
                          focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emailEdit">E-mail</Label>
                        <Input
                          id="emailEdit"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 rounded-xl w-full py-2
                          rounded-2xl border border-gray-200 bg-white shadow-sm
                          focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="rounded-full transition-all transform hover:scale-105"
                          disabled={isUpdatingProfile}
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleProfileUpdate}
                        className="w-fit rounded-full transition-all transform hover:scale-105 hover:bg-green-500 active:scale-95 border-2 border-transparent hover:border-green-700"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isUpdatingProfile ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            {/* Card de Alteração de Senha */}
            <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Para sua segurança, recomendamos o uso de senhas fortes.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-fit rounded-full bg-gray-800 text-white transition-all transform hover:scale-105 hover:bg-gray-700 active:scale-95"
                    >
                      Alterar Senha
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Alterar sua senha</DialogTitle>
                      <DialogDescription>
                        Preencha os campos abaixo para definir uma nova senha.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="Sua senha atual"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1 rounded-xl w-full py-2
                          rounded-2xl border border-gray-200 bg-white shadow-sm
                          focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Digite a nova senha"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1 rounded-xl w-full py-2
                          rounded-2xl border border-gray-200 bg-white shadow-sm
                          focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">
                          Confirmar Nova Senha
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Digite novamente sua nova senha"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 rounded-xl w-full py-2
                          rounded-2xl border border-gray-200 bg-white shadow-sm
                          focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="rounded-full transition-all transform hover:scale-105"
                          disabled={isChangingPassword}
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handlePasswordChange}
                        className="w-fit rounded-full transition-all transform hover:scale-105 hover:bg-green-500 active:scale-95 border-2 border-transparent hover:border-green-700"
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isChangingPassword ? "Alterando..." : "Salvar Nova Senha"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Card da Zona de Perigo */}
            <Card className="border-red-500 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                <CardDescription>
                  A exclusão da sua conta é uma ação irreversível.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-fit rounded-full transition-all transform hover:scale-105 hover:bg-red-500 active:scale-95 border-2 border-transparent hover:border-red-700"
                    >
                      Excluir conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você tem certeza absoluta?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente sua conta e removerá seus dados de
                        nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="w-fit rounded-full  transform hover:scale-105 bg-green-500 active:scale-95 border-2 border-transparent hover:border-green-700">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className={cn(
                          buttonVariants({ variant: "destructive" }) +
                            " w-fit rounded-full transition-all transform hover:scale-105 hover:bg-red-500 active:scale-95 border-2 border-transparent hover:border-red-700",
                        )}
                      >
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}