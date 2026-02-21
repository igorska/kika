"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BuyButton from "./BuyButton";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

interface HeroProps {
  onBuyClick: () => void;
}

export default function Hero({ onBuyClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/header_1.jpg"
        alt="Как собрать идеальную косметичку"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={item}
          className="text-primary-light text-sm md:text-base tracking-[0.18em] uppercase mb-4 font-sans font-medium"
        >
          Авторский гайд визажиста
        </motion.p>

        <motion.h1
          variants={item}
          className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6"
        >
          Как собрать{" "}
          <span className="text-primary">идеальную</span>{" "}
          косметичку?
        </motion.h1>

        <motion.p
          variants={item}
          className="text-white/80 text-base md:text-xl mb-10 max-w-xl leading-relaxed font-sans"
        >
          Гайд о том, как собрать идеальную косметичку и не разориться на
          бесполезных банках
        </motion.p>

        <motion.div variants={item}>
          <BuyButton onClick={onBuyClick} />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="w-px h-12 bg-white/40 origin-top">
          <motion.div
            className="w-full bg-white/80"
            style={{ height: "40%" }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
