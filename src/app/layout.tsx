import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Как собрать идеальную косметичку?",
  description:
    "Гайд о том, как собрать идеальную косметичку и не разориться на бесполезных банках",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
