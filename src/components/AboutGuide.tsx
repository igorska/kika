import BuyButton from "./BuyButton";

export default function AboutGuide() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">О <span className="border-b-2 border-primary pb-0.5">гайде</span></h2>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Этот гайд станет вашим личным навигатором в мире бьюти. Я создала его для того, чтобы каждая девушка могла собрать свою идеальную косметичку, не совершая лишних трат.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-10">
          В нем собрана лучшая косметика из люкса и крутые бюджетные находки, чтобы вы могли собрать свою идеальную косметичку и не тратили деньги на бесполезные баночки. За 6 лет работы визажистом я протестировала сотни средств и не раз разочаровывалась в тех, что не оправдали ожиданий. Здесь вы найдете только проверенные и рабочие продукты, а также полезные советы, которые научат вас выбирать косметику самостоятельно
        </p>
        <BuyButton label="Хочу гайд" />
      </div>
    </section>
  );
}
