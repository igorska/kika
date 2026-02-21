"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
        <motion.p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium text-center mb-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          Об авторе
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-12 text-center text-charcoal"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Об авторе
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Photo column */}
          <motion.div
            className="flex-shrink-0 mx-auto md:mx-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              />
              {/* Experience badge */}
              <motion.div
                className="absolute bottom-2 right-0 bg-primary text-white text-xs font-bold font-sans px-3 py-1.5 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                  delay: 0.4,
                }}
              >
                6 лет опыта
              </motion.div>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            className="flex-1 space-y-4 text-base leading-relaxed text-charcoal/80 font-sans"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  <span className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{b}</span>
                </motion.li>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
