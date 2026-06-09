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
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s | Amaterra Admin",
    default: "Amaterra Admin",
  },
  description: "Панель управления клиникой Amaterra",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Admin",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function AdminLayout({ children }: PropsWithChildren) {
  const { userEmail } = await getAdminContext();

  return (
    <Providers>
      <NextTopLoader color="#10b981" showSpinner={false} />
      {/* PWA: Apple touch icon */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <Script id="admin-sw" strategy="afterInteractive">{`
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' })
              .then(function(reg) { console.log('Admin SW registered:', reg.scope); })
              .catch(function(err) { console.warn('Admin SW failed:', err); });
          });
        }
      `}</Script>
      <AdminShell userEmail={userEmail}>
        {children}
      </AdminShell>
    </Providers>
  );
}
