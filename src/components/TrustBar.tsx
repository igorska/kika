"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "6 лет", label: "опыта в визаже" },
  { value: "100+", label: "протестированных средств" },
  { value: "2 бюджета", label: "люкс и доступные" },
];

export default function TrustBar() {
  return (
    <section className="bg-charcoal py-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-white/10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.value}
            className="flex flex-col items-center text-center px-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-primary leading-none mb-2">
              {stat.value}
            </span>
            <span className="text-white/70 text-sm tracking-wider uppercase font-sans">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
