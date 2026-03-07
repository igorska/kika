import BuyButton from "./BuyButton";
import { APP_CONFIG } from "@/lib/config";

interface CtaSectionProps {
  onBuyClick: () => void;
}

export default function CtaSection({ onBuyClick }: CtaSectionProps) {
  return (
    <section className="bg-charcoal section-padding relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium mb-4"
          data-animate="fade-up"
        >
          Начните прямо сейчас
        </p>

        <h2
          className="text-3xl md:text-5xl font-bold mb-4 text-white"
          data-animate="fade-up"
          data-delay="1"
        >
          Готовы собрать идеальную косметичку?
        </h2>

        <p
          className="text-base md:text-lg text-white/60 mb-10 font-sans"
          data-animate="fade-up"
          data-delay="2"
        >
          Получите гайд с проверенными продуктами и профессиональными советами
        </p>

        <div data-animate="fade-up" data-delay="3" className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white text-xs font-bold font-sans uppercase tracking-widest px-3 py-1 rounded-full">
              Скидка
            </span>
            <span className="line-through text-white/40 text-xl font-sans">{APP_CONFIG.priceOriginal}</span>
            <span className="text-white text-4xl font-bold font-sans">{APP_CONFIG.price}</span>
          </div>
          <BuyButton label="Купить гайд" onClick={onBuyClick} />
        </div>
      </div>
    </section>
  );
}
