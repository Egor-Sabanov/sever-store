import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sever.store"),
  title: { default: "СЕВЕР — вещи для своего темпа", template: "%s · СЕВЕР" },
  description:
    "Городская одежда и аксессуары для своего маршрута. Новый дроп «Вне сезона» уже в каталоге.",
  openGraph: {
    title: "СЕВЕР — вещи для своего темпа",
    description: "Одежда, которая не просит разрешения.",
    locale: "ru_RU",
    type: "website",
    url: "/",
    siteName: "СЕВЕР",
    images: [{ url: "/images/hero.jpg", alt: "Городская одежда СЕВЕР" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "СЕВЕР — вещи для своего темпа",
    description: "Одежда, которая не просит разрешения.",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
