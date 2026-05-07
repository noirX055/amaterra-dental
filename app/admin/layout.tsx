import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { getAdminContext } from "./getAdminContext";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: {
    template: "%s | Amaterra Admin",
    default: "Amaterra Admin",
  },
  description: "Панель управления клиникой Amaterra",
};

export default async function AdminLayout({ children }: PropsWithChildren) {
  const { userEmail } = await getAdminContext();

  return (
    <Providers>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <AdminShell userEmail={userEmail}>
        {children}
      </AdminShell>
    </Providers>
  );
}
