"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const desktopCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 320, damping: 24 } },
  exit: { opacity: 0, scale: 0.88, transition: { duration: 0.18 } },
};

const mobileCardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
  exit: { opacity: 0, y: 60, transition: { duration: 0.18 } },
};

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Что-то пошло не так. Попробуйте снова.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Ошибка соединения. Попробуйте снова.");
      setLoading(false);
    }
  }

  const cardVariants = isMobile ? mobileCardVariants : desktopCardVariants;
  const cardPositionClasses = isMobile
    ? "fixed bottom-0 left-0 right-0 z-50"
    : "fixed inset-0 z-50 flex items-center justify-center pointer-events-none";
  const cardClasses = isMobile
    ? "bg-cream rounded-t-2xl px-6 pt-6 pb-[env(safe-area-inset-bottom)] max-h-[90dvh] overflow-y-auto pointer-events-auto w-full"
    : "bg-cream rounded-2xl px-8 py-10 max-w-md w-full mx-4 pointer-events-auto";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Card wrapper */}
          <div className={cardPositionClasses}>
            <motion.div
              key="card"
              className={cardClasses}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-primary text-xs tracking-[0.16em] uppercase font-medium mb-1">
                    Оформление
                  </p>
                  <h2 className="text-2xl font-bold text-charcoal">Купить гайд</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-charcoal/40 hover:text-charcoal transition-colors p-1 -mr-1 -mt-1"
                  aria-label="Закрыть"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1.5" htmlFor="modal-name">
                    Ваше имя
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Имя"
                    className="w-full text-[16px] border border-charcoal/20 rounded-lg px-4 py-3 text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1.5" htmlFor="modal-email">
                    Электронная почта
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-[16px] border border-charcoal/20 rounded-lg px-4 py-3 text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                  <p className="mt-1.5 text-xs text-charcoal/50 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <polyline points="2,4 12,13 22,4" />
                    </svg>
                    Гайд будет автоматически отправлен на эту почту сразу после оплаты
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="mt-2 relative bg-primary text-white font-bold py-4 px-10 rounded-full text-base tracking-wide overflow-hidden disabled:opacity-70 shadow-[0_4px_24px_rgba(161,36,91,0.4)] hover:shadow-[0_6px_32px_rgba(161,36,91,0.6)] transition-shadow"
                  whileHover={!loading ? { scale: 1.03 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {loading ? "Переходим в Stripe…" : "Перейти к оплате"}
                </motion.button>

                <p className="text-center text-xs text-charcoal/40 mt-1">
                  Безопасная оплата через Stripe
                </p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
