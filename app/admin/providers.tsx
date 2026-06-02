"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { AdminLangProvider } from "./_components/admin-lang-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLangProvider>{children}</AdminLangProvider>
    </SidebarProvider>
  );
}
