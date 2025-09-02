// app/perfil/page.tsx

"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { Notification, NotificationType } from "@/components/ui/notification";
import { updateUserProfile, changePassword } from "@/lib/api"; 

const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

export default function PerfilPage() {
  const { user, login, logout, isLoading } = useAuth(); 
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("/avatars/avatar1.png");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const addNotification = (text: string, type: "success" | "error") => {
    const newNotif: NotificationType = { id: Math.random(), text, type };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeNotif = (id: number) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><p>Carregando perfil...</p></div>;
  }

  if (!user) {
    if (typeof window !== 'undefined') { window.location.href = '/login'; }
    return null;
  }
  
  const handleSaveChanges = async () => {
    if (!user?.token) {
        addNotification("Erro de autenticação. Por favor, faça login novamente.", "error");
        return;
    }

    const profileData = {
        username,
        email,
        avatarUrl: selectedAvatar
    };

    try {
        const updatedUser = await updateUserProfile(profileData, user.token);
        login({ ...user, ...updatedUser }); 
        addNotification("Perfil atualizado com sucesso!", "success");
    } catch (error) {
        addNotification("Não foi possível atualizar o perfil. Tente novamente.", "error");
        console.error(error);
    }
  };

  // Função para alterar a senha
  const handleChangePassword = async () => {
    if (!user?.token) {
        addNotification("Erro de autenticação. Por favor, faça login novamente.", "error");
        return;
    }
    if (!currentPassword || !newPassword) {
        addNotification("Por favor, preencha a senha atual e a nova senha.", "error");
        return;
    }

    const passwordData = { currentPassword, newPassword };

    try {
        await changePassword(passwordData, user.token);
        addNotification("Senha alterada com sucesso!", "success");
        // Limpa os campos de senha por segurança
        setCurrentPassword("");
        setNewPassword("");
    } catch (error) {
        addNotification("Não foi possível alterar a senha. Verifique sua senha atual.", "error");
        console.error(error);
    }
  };

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
                            <CardHeader className="text-center">
                                <img src={selectedAvatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500"/>
                                <CardTitle>{user.nomeCompleto}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <Button onClick={handleSaveChanges} className="w-full">Salvar Alterações</Button>
                                <Button onClick={logout} variant="destructive" className="w-full">Sair</Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader><CardTitle>Configurações da Conta</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nome de Usuário</Label>
                                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Alterar Senha</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Senha Atual</Label>
                                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Nova Senha</Label>
                                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <Button onClick={handleChangePassword} variant="secondary">Alterar Senha</Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Escolha seu Avatar</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-4">
                                {avatarOptions.map(avatar => (
                                <button key={avatar} onClick={() => setSelectedAvatar(avatar)} className={`w-16 h-16 rounded-full overflow-hidden border-2 hover:border-purple-600 transition-transform hover:scale-110 ${selectedAvatar === avatar ? 'border-purple-600' : 'border-gray-200'}`}>
                                    <img src={avatar} alt="Opção de avatar"/>
                                </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}