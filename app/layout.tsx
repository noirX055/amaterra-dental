import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo/schema";
import { Analytics } from "@/components/Analytics";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
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
    google: "your-google-verification-code",
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
