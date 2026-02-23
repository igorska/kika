import BuyButton from "./BuyButton";

interface AboutGuideProps {
  onBuyClick: () => void;
}

export default function AboutGuide({ onBuyClick }: AboutGuideProps) {
  return (
    <section className="bg-cream section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium text-center mb-3"
          data-animate="fade-up"
        >
          О гайде
        </p>

        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-bold text-center text-charcoal mb-10"
          data-animate="fade-up"
          data-delay="1"
        >
          О <span className="border-b-2 border-primary pb-1">гайде</span>
        </h2>

        {/* Divider */}
        <div
          className="flex items-center justify-center gap-3 mb-12"
          data-animate="fade"
          data-delay="2"
        >
          <div className="h-px bg-primary/40 flex-1 max-w-[120px]" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="h-px bg-primary/40 flex-1 max-w-[120px]" />
        </div>

        {/* Two-column prose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-base md:text-lg leading-relaxed text-charcoal/80 font-sans">
          <p data-animate="fade-left" data-delay="1">
            Этот гайд станет вашим личным навигатором в мире бьюти. Я создала
            его для того, чтобы каждая девушка могла собрать свою идеальную
            косметичку, не совершая лишних трат.
          </p>
          <p data-animate="fade-right" data-delay="1">
            В нем собрана лучшая косметика из люкса и крутые бюджетные находки.
            За 6 лет работы визажистом я протестировала сотни средств — здесь
            только проверенные продукты и полезные советы, которые научат вас
            выбирать косметику самостоятельно.
          </p>
        </div>

        <div className="flex justify-center" data-animate="fade-up" data-delay="2">
          <BuyButton label="Хочу гайд" onClick={onBuyClick} />
        </div>
      </div>
    </section>
  );
}
