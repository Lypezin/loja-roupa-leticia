import type { Metadata, Viewport } from "next";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getStoreSettings } from "@/lib/storefront";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  const title = settings?.store_name || "Fashion Store";
  const description = settings?.store_description || "Curadoria de moda com cortes limpos, materiais honestos e uma presenca tranquila.";

  return {
    title: {
      default: `${title} | Oficial`,
      template: `%s | ${title}`
    },
    description,
    keywords: ["moda", "roupas", "loja online", "curadoria", "atelier"],
    authors: [{ name: title }],
    creator: title,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: "https://loja-roupa.vercel.app",
      siteName: title,
      title: `${title} | Colecao Atual`,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextTopLoader color="var(--primary)" showSpinner={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
