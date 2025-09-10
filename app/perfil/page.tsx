"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { Notification, NotificationType } from "@/components/ui/notification";
import { updateUserAvatar } from "@/lib/api";
import Image from "next/image";

const AVATAR_BASE_PATH = "/avatars/";
const avatarOptions = ["avatar-homem.png", "avatar-mulher.png"];

export default function PerfilPage() {
  const { user, logout, isLoading, updateUser } = useAuth();

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<
    string | undefined
  >("");

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedAvatarFile(user.chosenAvatar || avatarOptions[0]);
    }
  }, [user]);

  const addNotification = (text: string, type: "success" | "error") => {
    const newNotif: NotificationType = { id: Math.random(), text, type };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeNotif = (id: number) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };

  const handleSaveAvatar = async () => {
    if (!user?.token || !selectedAvatarFile) {
      addNotification(
        "Erro de autenticação ou nenhum avatar selecionado.",
        "error"
      );
      return;
    }

    try {
      const updatedUserData = await updateUserAvatar(
        selectedAvatarFile,
        user.token
      );
      const newAvatar = updatedUserData.chosenAvatar;

      updateUser({ chosenAvatar: newAvatar });

      addNotification("Avatar atualizado com sucesso!", "success");
    } catch (error) {
      addNotification(
        "Não foi possível atualizar o avatar. Tente novamente.",
        "error"
      );
      console.error(error);
    }
  };

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

  return (
    <div>
      <div className="flex flex-col gap-1 w-72 fixed top-4 right-4 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>

      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center flex flex-col items-center">
                  {/* caminho completo da imagem aqui */}
                  {selectedAvatarFile && (
                    <Image
                      src="/avatars/default-avatar.png"
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500 object-cover"
                    />
                  )}
                  <CardTitle>{user.nomeCompleto}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className="w-full"
                  >
                    Sair
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Escolha seu Avatar</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  {avatarOptions.map((avatarFile) => (
                    <button
                      key={avatarFile}
                      onClick={() => setSelectedAvatarFile(avatarFile)}
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 hover:border-purple-600 transition-transform hover:scale-110 ${
                        selectedAvatarFile === avatarFile
                          ? "border-purple-600"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={`${AVATAR_BASE_PATH}${avatarFile}`}
                        alt={`Opção de avatar ${avatarFile}`}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </CardContent>
              </Card>
              <Button onClick={handleSaveAvatar} className="w-full">
                Salvar Avatar
              </Button>
              <h1>Alterar senha</h1>
              <h1>excluir conta</h1>
              <h1>alterar nome de usuário</h1>
              <h1>Alterar Nome Completo</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
