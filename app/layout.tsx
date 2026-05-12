import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo/schema";
import { Analytics } from "@/components/Analytics";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Amaterra Dental Clinic - Современная стоматология в Кишиневе",
    template: "%s | Amaterra Dental"
  },
  description: "Современная стоматологическая клиника в Кишиневе. Профессиональное лечение зубов, имплантация, отбеливание. Опытные врачи, современное оборудование, доступные цены.",
  keywords: ["стоматология Кишинев", "зубной врач", "лечение зубов", "имплантация зубов", "отбеливание зубов", "стоматологическая клиника", "Amaterra"],
  authors: [{ name: "Amaterra Dental Clinic" }],
  creator: "Amaterra Dental Clinic",
  publisher: "Amaterra Dental Clinic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://amaterra.md"),
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/favicon.ico' },
    ],
    apple: [
      { url: '/icons/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/icons/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/icons/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/icons/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/icons/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/icons/apple-icon-precomposed.png' },
    ],
  },
  manifest: '/icons/manifest.json',
  alternates: {
    canonical: "/",
    languages: {
      "ru-MD": "/",
      "ro-MD": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    title: "Amaterra Dental Clinic - Современная стоматология",
    description: "Профессиональное лечение зубов в Кишиневе. Опытные врачи, современное оборудование.",
    url: "https://amaterra.md",
    siteName: "Amaterra Dental Clinic",
    locale: "ru_MD",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amaterra Dental Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaterra Dental Clinic",
    description: "Современная стоматология в Кишиневе",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "8ZCcci8ntM0VFvlKJjFCK9-cQCFFi6CoEKp23Rmy6SI",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${montserrat.variable} ${jetbrainsMono.variable} dark h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
