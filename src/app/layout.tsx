import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('store_settings').select('*').single();

  const title = settings?.store_name || "Fashion Store";
  const description = settings?.store_description || "As melhores peças e a nova coleção de ponta. Qualidade, estilo e conforto em um só lugar.";

  return {
    title: {
      default: `${title} | Oficial`,
      template: `%s | ${title}`
    },
    description,
    keywords: ["moda", "roupas", "fashion", "loja online", "coleção 2025"],
    authors: [{ name: title }],
    creator: title,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: "https://loja-roupa.vercel.app",
      siteName: title,
      title: `${title} | Coleção 2025`,
      description: description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="var(--primary)" showSpinner={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
