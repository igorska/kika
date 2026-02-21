import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <main className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Checkmark circle */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A1245B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium mb-3">
          Оплата прошла
        </p>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-charcoal mb-6">
          Спасибо за покупку!
        </h1>

        {/* Body */}
        <p className="text-charcoal/70 text-base md:text-lg leading-relaxed font-sans mb-10">
          Гайд отправлен на вашу почту. Проверьте «Входящие» и «Спам».
        </p>

        {/* Back link */}
        <Link
          href="/"
          className="inline-block text-primary font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          ← Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
