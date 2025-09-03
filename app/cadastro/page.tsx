// app/cadastro
// app/cadastro/page.tsx

"use client";

import { useState } from "react";
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
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import { Notification, NotificationType } from "@/components/ui/notification";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nome_completo_user, setNomeCompleto] = useState("");

  //  para controlar as notificações
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  //  adicionar uma notificação
  const addNotification = (text: string, type: "success" | "error") => {
    const newNotif: NotificationType = {
      id: Math.random(),
      text,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Função para remover uma notificação
  const removeNotif = (id: number) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      nomeCompleto: nome_completo_user,
      username: username,
      email: email,
      password: password, // A API espera 'senha', não 'password'
    };

    try {
      await registerUser(userData);

      //  notificação de sucesso
      addNotification(
        "Cadastro realizado com sucesso! Você será redirecionado.",
        "success"
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      addNotification(
        "Erro ao cadastrar. Verifique seus dados e tente novamente.",
        "error"
      );
      console.error(err);
    }
  };

  return (
    <div>
      {/* Container onde as notificações aparecerão */}
      <div className="flex flex-col gap-1 w-72 fixed top-4 right-4 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center h-screen bg-gray-50 px-4 ">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" passHref>
              <Image
                src="/LogoMeideSaqua.png"
                alt="Logo MeideSaquá"
                width={150}
                height={150}
                className="mx-auto"
              />
            </Link>
          </div>
          <Card
            className="rounded-2xl border border-purple-600/70 bg-white shadow-lg
                             focus:outline-none focus:ring-2 focus:border-transparent
                             transition-all duration-300 placeholder-gray-400 text-sm
                             hover:shadow-md"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Crie seu Cadastro</CardTitle>
              <CardDescription>
                Insira suas credenciais para ter a possibilidade de avaliar os
                estabelecimentos.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu nome de usuário"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-2
                                    rounded-2xl border border-gray-200 bg-white shadow-sm
                                    focus:ring-2 focus:border-orange-500/70 transition-all duration-300
                                    "
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_completo_user">Nome Completo</Label>
                  <Input
                    id="nome_completo_user"
                    type="text"
                    placeholder="Digite seu nome completo"
                    required
                    value={nome_completo_user}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    className="w-full py-2
                                    rounded-2xl border border-gray-200 bg-white shadow-sm
                                    focus:ring-2 focus:border-orange-500/70 transition-all duration-300
                                    "
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2
                                    rounded-2xl border border-gray-200 bg-white shadow-sm
                                    focus:ring-2 focus:border-orange-500/70 transition-all duration-300
                                    "
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2
                                    rounded-2xl border border-gray-200 bg-white shadow-sm
                                    focus:ring-2 focus:border-orange-500/70 transition-all duration-300
                                    "
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="hover:bg-orange-500 rounded-2xl hover:text-white flex justify-center mx-auto px-10  text-gray-700 border border-purple-600/70"
                >
                  Criar Conta
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
