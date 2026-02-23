import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/Footer";
import AnimationObserver from "@/components/AnimationObserver";

const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  variable: "--font-playfair",
  display: "swap",
});


const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#A1245B",
};

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: "Как собрать идеальную косметичку — Гайд визажиста",
    template: "%s | Гайд визажиста",
  },
  description:
    "Авторский гайд визажиста: как собрать косметичку, какую косметику выбрать и не разориться на ненужных средствах. Проверенные продукты, советы профессионала.",
  keywords: [
    "как собрать косметичку",
    "гайд по косметике",
    "визажист гайд",
    "косметичка визажиста",
    "какую косметику купить",
    "гайд по макияжу",
    "косметика для визажиста",
    "идеальная косметичка",
  ],
  authors: [{ name: "Кристина" }],
  creator: "Кристина",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: base,
    siteName: "Гайд Кристины",
    title: "Как собрать идеальную косметичку — Гайд визажиста",
    description:
      "Авторский гайд профессионального визажиста: как собрать косметичку, какую косметику выбрать и не разориться на бесполезных средствах.",
    images: [
      {
        url: "/header_1.jpg",
        width: 1200,
        height: 630,
        alt: "Гайд: Как собрать идеальную косметичку",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Как собрать идеальную косметичку — Гайд визажиста",
    description:
      "Авторский гайд профессионального визажиста: как собрать косметичку и не разориться на ненужных средствах.",
    images: ["/header_1.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={playfair.variable}>
      <body className="font-sans antialiased">
        <JsonLd />
        <AnimationObserver />
        {children}
        <Footer />
      </body>
    </html>
  );
}
