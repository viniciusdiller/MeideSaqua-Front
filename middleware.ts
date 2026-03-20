// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Pega o token direto do Cookie
  const token = request.cookies.get("admin_token")?.value;
  const path = request.nextUrl.pathname;

  const isLoginPage = path === "/admin/login";
  const isAdminRoute = path.startsWith("/admin");

  // Se tentar acessar QUALQUER página /admin (exceto login) sem token, chuta pro login
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// Configura o middleware para rodar APENAS nas rotas de admin
export const config = {
  matcher: ["/admin/:path*"],
};
