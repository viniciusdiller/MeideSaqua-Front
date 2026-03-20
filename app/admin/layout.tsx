// app/admin/layout.tsx
import React from "react";
import AdminTokenTimer from "@/components/admin/AdminTokenTimer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminTokenTimer />
      {children}
    </>
  );
}
