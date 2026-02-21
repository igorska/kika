"use client";

import { motion } from "framer-motion";
import BuyButton from "./BuyButton";

export default function CtaSection() {
  return (
    <section className="bg-charcoal section-padding relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium mb-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          Начните прямо сейчас
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Готовы собрать идеальную косметичку?
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-white/60 mb-10 font-sans"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Получите гайд с проверенными продуктами и профессиональными советами
        </motion.p>

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
        >
          <BuyButton label="Купить гайд" />
        </motion.div>
      </div>
    </section>
  );
}
