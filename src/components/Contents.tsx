"use client";

import { motion } from "framer-motion";

const chapters = [
  {
    number: "01",
    title: "Средства в двух бюджетах",
    description:
      "В каждой категории — варианты в более доступном и более премиальном сегменте",
  },
  {
    number: "02",
    title: "База знаний по выбору и нанесению",
    description:
      "Описаны базовые принципы подбора косметики и техники её нанесения",
  },
  {
    number: "03",
    title: "Полный набор средств",
    description: "От тоника до кистей — всё, что нужно для идеальной косметички",
  },
  {
    number: "04",
    title: "Подробное описание каждого продукта",
    description: "С фото и рекомендациями по применению",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function Contents() {
  return (
    <section className="bg-charcoal section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium text-center mb-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          Содержание
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-12 text-center text-white"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Что внутри
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {chapters.map((ch) => (
            <motion.div
              key={ch.number}
              variants={cardVariant}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-default"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="font-serif text-4xl font-bold text-primary leading-none">
                  {ch.number}
                </span>
                <div className="flex-1 h-px bg-white/10 group-hover:bg-primary/40 transition-colors duration-300" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 text-white">
                {ch.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/60 font-sans">
                {ch.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
