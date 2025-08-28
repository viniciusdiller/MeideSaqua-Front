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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Adicione aqui a sua lógica de autenticação com o Firebase
    console.log("Email:", email);
    console.log("Senha:", password);
    alert("Lógica de login a ser implementada!");
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
            <CardTitle className="text-2xl">Efetue o Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para ter a possibilidade de avaliar os
              estabelecimentos.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
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
                Entrar
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4 text-center text-sm">
          <Link
            href="#"
            className="underline text-gray-600 hover:text-purple-800"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
