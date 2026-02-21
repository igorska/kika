"use client";

import { motion } from "framer-motion";
import BuyButton from "./BuyButton";

interface AboutGuideProps {
  onBuyClick: () => void;
}

export default function AboutGuide({ onBuyClick }: AboutGuideProps) {
  return (
    <section className="bg-cream section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          className="text-primary text-sm tracking-[0.16em] uppercase font-sans font-medium text-center mb-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          О гайде
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-charcoal mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          О <span className="border-b-2 border-primary pb-1">гайде</span>
        </motion.h2>

        {/* Animated divider */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="h-px bg-primary/40 flex-1 max-w-[120px]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: "right" }}
          />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <motion.div
            className="h-px bg-primary/40 flex-1 max-w-[120px]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>

        {/* Two-column prose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-base md:text-lg leading-relaxed text-charcoal/80 font-sans">
          <motion.p
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Этот гайд станет вашим личным навигатором в мире бьюти. Я создала
            его для того, чтобы каждая девушка могла собрать свою идеальную
            косметичку, не совершая лишних трат.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            В нем собрана лучшая косметика из люкса и крутые бюджетные находки.
            За 6 лет работы визажистом я протестировала сотни средств — здесь
            только проверенные продукты и полезные советы, которые научат вас
            выбирать косметику самостоятельно.
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BuyButton label="Хочу гайд" onClick={onBuyClick} />
        </motion.div>
      </div>
    </section>
  );
}
