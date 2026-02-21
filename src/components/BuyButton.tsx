"use client";

import { motion } from "framer-motion";

interface BuyButtonProps {
  label?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}

export default function BuyButton({
  label = "Купить гайд",
  variant = "primary",
  onClick,
}: BuyButtonProps) {
  const base =
    "relative inline-block font-bold py-4 px-10 rounded-full text-base tracking-wide overflow-hidden cursor-pointer";

  const styles =
    variant === "ghost"
      ? "text-white border-2 border-white/60 hover:border-white"
      : "text-white bg-primary shadow-[0_4px_24px_rgba(232,58,124,0.45)] hover:shadow-[0_6px_32px_rgba(232,58,124,0.65)]";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${base} ${styles} group`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {variant === "primary" && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            backgroundSize: "200% auto",
            animation: "shimmer 2.4s linear infinite",
          }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
