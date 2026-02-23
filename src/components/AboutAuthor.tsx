import Image from "next/image";

const bullets = [
  "красиво выглядят на коже;",
  "легко наносятся и тушуются;",
  "подходят под разные бюджеты;",
  "и действительно стоят своих денег.",
];

export default function AboutAuthor() {
  return (
    <section className="bg-white section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium text-center mb-3"
          data-animate="fade-up"
        >
          Об авторе
        </p>

        <h2
          className="text-3xl md:text-5xl font-bold mb-12 text-center text-charcoal"
          data-animate="fade-up"
          data-delay="1"
        >
          Об авторе
        </h2>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Photo column */}
          <div
            className="flex-shrink-0 mx-auto md:mx-0"
            data-animate="fade-left"
            data-delay="1"
          >
            <div className="relative w-[220px] h-[220px]">
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-full border-2 border-primary/25" />
              <Image
                src="/author.jpg"
                alt="Кристина"
                width={220}
                height={220}
                className="rounded-full object-cover w-[220px] h-[220px]"
                sizes="220px"
              />
              {/* Experience badge */}
              <div
                className="absolute bottom-2 right-0 bg-primary text-white text-xs font-bold font-sans px-3 py-1.5 rounded-full shadow-lg"
                data-animate="scale-in"
                data-delay="3"
              >
                6 лет опыта
              </div>
            </div>
          </div>

          {/* Text column */}
          <div
            className="flex-1 space-y-4 text-base leading-relaxed text-charcoal/80 font-sans"
            data-animate="fade-right"
            data-delay="1"
          >
            <p>Привет, меня зовут Кристина.</p>
            <p>Я профессиональный визажист.</p>
            <p>
              За 6 лет в Калифорнии я протестировала тысячи текстур и точно
              знаю, как собрать идеальную косметичку.
            </p>
            <p>
              Я работала с разными типами кожи, разными возрастами и запросами
              — от лёгкого ежедневного макияжа до съёмок и особых событий.
              Поэтому в этом гайде нет случайных средств.
            </p>

            {/* Quote-style intro */}
            <p className="font-serif italic border-l-2 border-primary pl-4 text-charcoal">
              Здесь только проверенные продукты, которые:
            </p>

            {/* Staggered bullets */}
            <ul className="space-y-2 pl-1">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                  data-animate="fade-up"
                  data-delay={String(i + 2)}
                >
                  <span className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <p>
              Я собрала не просто список покупок, а систему — как выбирать и
              как этим пользоваться.
            </p>
            <p>
              Этот гайд — результат моего опыта, ошибок, тестов и реальной
              работы.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
