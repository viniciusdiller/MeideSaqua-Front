//CADASTRO

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
import { registerUser } from "@/lib/api"; //FUNCAO API

export default function NovaSenha() {
  const [email, setEmail] = useState("");
  const [nome_completo_user, setNomeCompleto] = useState("");
  const [error, setError] = useState<string | null>(null); //  Estado para guardar a mensagem de erro

  //  Função atualizada para lidar com o registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    //  Monta o objeto com os dados para enviar à API
    const userData = {
      nomeCompleto: nome_completo_user,
      email: email,
    };

    try {
      // Chama a função da API
      await registerUser(userData);
      alert("Email Enviado com Sucesso! Verifique sua caixa de entrada.");
      //  Redireciona para a página de login após o sucesso
      window.location.href = "/login";
    } catch (err) {
      //  caso der erro, aparece a msg de erro
      setError("Erro ao procurar dados. Verifique os dados e tente novamente.");
      console.error(err);
    }
  };

  return (
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
            <CardTitle className="text-2xl">Recupere sua senha</CardTitle>
            <CardDescription>
              Insira suas credenciais corretamente para modificar sua senha.
            </CardDescription>
          </CardHeader>
          {/*  O formulário chama handleRegister */}
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
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
              {/* Exibe a mensagem de erro, se houver */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="hover:bg-orange-500 rounded-2xl hover:text-white flex justify-center mx-auto px-10  text-gray-700 border border-purple-600/70"
              >
                Enviar email
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
