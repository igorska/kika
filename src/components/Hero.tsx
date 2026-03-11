import Image from "next/image";
import BuyButton from "./BuyButton";
import { APP_CONFIG } from "@/lib/config";

interface HeroProps {
  onBuyClick: () => void;
}

export default function Hero({ onBuyClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-svh flex items-center justify-center overflow-hidden">
      <Image
        src="/header_1.jpg"
        alt="Как собрать идеальную косметичку"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        <p
          className="hero-anim text-primary-light text-sm md:text-base tracking-[0.18em] uppercase mb-4 font-sans font-medium"
          style={{ animationDelay: "0.1s" }}
        >
          Авторский гайд визажиста
        </p>

        <h1
          className="hero-anim text-white text-4xl md:text-6xl font-bold leading-tight mb-6"
          style={{ animationDelay: "0.28s" }}
        >
          Как собрать{" "}
          <span className="text-primary">идеальную</span>{" "}
          косметичку?
        </h1>

        <p
          className="hero-anim text-white/80 text-base md:text-xl mb-10 max-w-xl leading-relaxed font-sans"
          style={{ animationDelay: "0.46s" }}
        >
          Гайд о том, как собрать идеальную косметичку и не разориться на
          бесполезных банках
        </p>

        <div className="hero-anim flex flex-col items-center gap-4" style={{ animationDelay: "0.64s" }}>
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white text-xs font-bold font-sans uppercase tracking-widest px-3 py-1 rounded-full">
              Скидка
            </span>
            <span className="line-through text-white/40 text-xl font-sans">{APP_CONFIG.priceOriginal}</span>
            <span className="text-white text-4xl font-bold font-sans">{APP_CONFIG.price}</span>
          </div>
          <BuyButton onClick={onBuyClick} source="hero" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-12 bg-white/40 origin-top">
          <div className="scroll-bounce w-full bg-white/80" />
        </div>
      </div>
    </section>
  );
}
