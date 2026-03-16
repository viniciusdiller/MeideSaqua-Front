"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    const isLoginPage = pathname === "/admin/login";

    if (!token && !isLoginPage) {
      router.push("/login");
    } else if (token && isLoginPage) {
      router.push("/admin/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (!isAuthorized && pathname !== "/admin/login") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Verificando permissões..." />
      </div>
    );
  }

  // Se passou nas validações, renderiza a página filha (cursos, dashboard, etc)
  return <>{children}</>;
}
