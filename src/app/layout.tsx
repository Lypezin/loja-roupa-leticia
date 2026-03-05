import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Loja de Roupas | Fashion Store",
    template: "%s | Fashion Store"
  },
  description: "As melhores peças e a nova coleção de ponta. Qualidade, estilo e conforto em um só lugar.",
  keywords: ["moda", "roupas", "fashion", "loja online", "coleção 2025"],
  authors: [{ name: "Fashion Store" }],
  creator: "Fashion Store",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://loja-roupa.vercel.app",
    siteName: "Fashion Store",
    title: "Fashion Store | Coleção 2025",
    description: "Sua loja de moda favorita com as melhores tendências.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
  },
  robots: {
    index: true,
    follow: true
  }
};

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
