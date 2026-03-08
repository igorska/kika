"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { APP_CONFIG } from "@/lib/config";

interface Country {
  code: string;
  dial: string;
  flag: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: "US", dial: "+1",   flag: "🇺🇸", name: "США" },
  { code: "RU", dial: "+7",   flag: "🇷🇺", name: "Россия" },
  { code: "UA", dial: "+380", flag: "🇺🇦", name: "Украина" },
  { code: "KZ", dial: "+7",   flag: "🇰🇿", name: "Казахстан" },
  { code: "BY", dial: "+375", flag: "🇧🇾", name: "Беларусь" },
  { code: "GE", dial: "+995", flag: "🇬🇪", name: "Грузия" },
  { code: "AM", dial: "+374", flag: "🇦🇲", name: "Армения" },
  { code: "AZ", dial: "+994", flag: "🇦🇿", name: "Азербайджан" },
  { code: "UZ", dial: "+998", flag: "🇺🇿", name: "Узбекистан" },
  { code: "TJ", dial: "+992", flag: "🇹🇯", name: "Таджикистан" },
  { code: "KG", dial: "+996", flag: "🇰🇬", name: "Кыргызстан" },
  { code: "TM", dial: "+993", flag: "🇹🇲", name: "Туркменистан" },
  { code: "MD", dial: "+373", flag: "🇲🇩", name: "Молдова" },
  { code: "MN", dial: "+976", flag: "🇲🇳", name: "Монголия" },
  { code: "IL", dial: "+972", flag: "🇮🇱", name: "Израиль" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "ОАЭ" },
  { code: "TR", dial: "+90",  flag: "🇹🇷", name: "Турция" },
  { code: "SA", dial: "+966", flag: "🇸🇦", name: "Саудовская Аравия" },
  { code: "KW", dial: "+965", flag: "🇰🇼", name: "Кувейт" },
  { code: "QA", dial: "+974", flag: "🇶🇦", name: "Катар" },
  { code: "BH", dial: "+973", flag: "🇧🇭", name: "Бахрейн" },
  { code: "OM", dial: "+968", flag: "🇴🇲", name: "Оман" },
  { code: "JO", dial: "+962", flag: "🇯🇴", name: "Иордания" },
  { code: "LB", dial: "+961", flag: "🇱🇧", name: "Ливан" },
  { code: "EG", dial: "+20",  flag: "🇪🇬", name: "Египет" },
  { code: "DE", dial: "+49",  flag: "🇩🇪", name: "Германия" },
  { code: "GB", dial: "+44",  flag: "🇬🇧", name: "Великобритания" },
  { code: "FR", dial: "+33",  flag: "🇫🇷", name: "Франция" },
  { code: "IT", dial: "+39",  flag: "🇮🇹", name: "Италия" },
  { code: "ES", dial: "+34",  flag: "🇪🇸", name: "Испания" },
  { code: "PT", dial: "+351", flag: "🇵🇹", name: "Португалия" },
  { code: "NL", dial: "+31",  flag: "🇳🇱", name: "Нидерланды" },
  { code: "BE", dial: "+32",  flag: "🇧🇪", name: "Бельгия" },
  { code: "CH", dial: "+41",  flag: "🇨🇭", name: "Швейцария" },
  { code: "AT", dial: "+43",  flag: "🇦🇹", name: "Австрия" },
  { code: "SE", dial: "+46",  flag: "🇸🇪", name: "Швеция" },
  { code: "NO", dial: "+47",  flag: "🇳🇴", name: "Норвегия" },
  { code: "FI", dial: "+358", flag: "🇫🇮", name: "Финляндия" },
  { code: "DK", dial: "+45",  flag: "🇩🇰", name: "Дания" },
  { code: "PL", dial: "+48",  flag: "🇵🇱", name: "Польша" },
  { code: "CZ", dial: "+420", flag: "🇨🇿", name: "Чехия" },
  { code: "SK", dial: "+421", flag: "🇸🇰", name: "Словакия" },
  { code: "HU", dial: "+36",  flag: "🇭🇺", name: "Венгрия" },
  { code: "RO", dial: "+40",  flag: "🇷🇴", name: "Румыния" },
  { code: "BG", dial: "+359", flag: "🇧🇬", name: "Болгария" },
  { code: "HR", dial: "+385", flag: "🇭🇷", name: "Хорватия" },
  { code: "RS", dial: "+381", flag: "🇷🇸", name: "Сербия" },
  { code: "GR", dial: "+30",  flag: "🇬🇷", name: "Греция" },
  { code: "LT", dial: "+370", flag: "🇱🇹", name: "Литва" },
  { code: "LV", dial: "+371", flag: "🇱🇻", name: "Латвия" },
  { code: "EE", dial: "+372", flag: "🇪🇪", name: "Эстония" },
  { code: "IE", dial: "+353", flag: "🇮🇪", name: "Ирландия" },
  { code: "IS", dial: "+354", flag: "🇮🇸", name: "Исландия" },
  { code: "CY", dial: "+357", flag: "🇨🇾", name: "Кипр" },
  { code: "CA", dial: "+1",   flag: "🇨🇦", name: "Канада" },
  { code: "MX", dial: "+52",  flag: "🇲🇽", name: "Мексика" },
  { code: "BR", dial: "+55",  flag: "🇧🇷", name: "Бразилия" },
  { code: "AR", dial: "+54",  flag: "🇦🇷", name: "Аргентина" },
  { code: "CL", dial: "+56",  flag: "🇨🇱", name: "Чили" },
  { code: "CO", dial: "+57",  flag: "🇨🇴", name: "Колумбия" },
  { code: "PE", dial: "+51",  flag: "🇵🇪", name: "Перу" },
  { code: "AU", dial: "+61",  flag: "🇦🇺", name: "Австралия" },
  { code: "NZ", dial: "+64",  flag: "🇳🇿", name: "Новая Зеландия" },
  { code: "IN", dial: "+91",  flag: "🇮🇳", name: "Индия" },
  { code: "CN", dial: "+86",  flag: "🇨🇳", name: "Китай" },
  { code: "JP", dial: "+81",  flag: "🇯🇵", name: "Япония" },
  { code: "KR", dial: "+82",  flag: "🇰🇷", name: "Южная Корея" },
  { code: "HK", dial: "+852", flag: "🇭🇰", name: "Гонконг" },
  { code: "TW", dial: "+886", flag: "🇹🇼", name: "Тайвань" },
  { code: "SG", dial: "+65",  flag: "🇸🇬", name: "Сингапур" },
  { code: "TH", dial: "+66",  flag: "🇹🇭", name: "Таиланд" },
  { code: "VN", dial: "+84",  flag: "🇻🇳", name: "Вьетнам" },
  { code: "ID", dial: "+62",  flag: "🇮🇩", name: "Индонезия" },
  { code: "MY", dial: "+60",  flag: "🇲🇾", name: "Малайзия" },
  { code: "PH", dial: "+63",  flag: "🇵🇭", name: "Филиппины" },
  { code: "PK", dial: "+92",  flag: "🇵🇰", name: "Пакистан" },
  { code: "BD", dial: "+880", flag: "🇧🇩", name: "Бангладеш" },
  { code: "LK", dial: "+94",  flag: "🇱🇰", name: "Шри-Ланка" },
  { code: "NP", dial: "+977", flag: "🇳🇵", name: "Непал" },
  { code: "IR", dial: "+98",  flag: "🇮🇷", name: "Иран" },
  { code: "MA", dial: "+212", flag: "🇲🇦", name: "Марокко" },
  { code: "DZ", dial: "+213", flag: "🇩🇿", name: "Алжир" },
  { code: "TN", dial: "+216", flag: "🇹🇳", name: "Тунис" },
  { code: "NG", dial: "+234", flag: "🇳🇬", name: "Нигерия" },
  { code: "GH", dial: "+233", flag: "🇬🇭", name: "Гана" },
  { code: "KE", dial: "+254", flag: "🇰🇪", name: "Кения" },
  { code: "ZA", dial: "+27",  flag: "🇿🇦", name: "ЮАР" },
];

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
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-detect country from IP when modal opens
  useEffect(() => {
    if (!isOpen || selectedCountry) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    fetch("https://ipapi.co/country_code/", { signal: controller.signal })
      .then(r => r.text())
      .then(code => {
        const match = COUNTRIES.find(c => c.code === code.trim().toUpperCase());
        if (match) setSelectedCountry(match);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { controller.abort(); clearTimeout(timer); };
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [dropdownOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
      )
    : COUNTRIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fullPhone = phone.trim() && selectedCountry ? `${selectedCountry.dial} ${phone.trim()}` : "";
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: fullPhone }),
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
                {/* Name */}
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

                {/* Email */}
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1.5" htmlFor="modal-phone">
                    Номер телефона <span className="text-charcoal/35 font-normal">(необязательно)</span>
                  </label>
                  <div className="flex rounded-lg border border-charcoal/20 focus-within:ring-2 focus-within:ring-primary/40 transition overflow-visible">
                    {/* Country selector */}
                    <div ref={dropdownRef} className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(v => !v)}
                        className="flex items-center gap-1.5 px-3 py-3 h-full text-[16px] text-charcoal border-r border-charcoal/20 hover:bg-charcoal/5 transition-colors rounded-l-lg whitespace-nowrap"
                      >
                        {selectedCountry ? (
                          <>
                            <span className="text-xl leading-none">{selectedCountry.flag}</span>
                            <span className="text-sm font-medium">{selectedCountry.dial}</span>
                          </>
                        ) : (
                          <span className="text-sm text-charcoal/35">Код</span>
                        )}
                        <svg className={`w-3.5 h-3.5 text-charcoal/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-charcoal/15 rounded-xl shadow-xl z-[60] overflow-hidden">
                          {/* Search */}
                          <div className="p-2 border-b border-charcoal/10">
                            <input
                              ref={searchRef}
                              type="text"
                              value={search}
                              onChange={e => setSearch(e.target.value)}
                              placeholder="Поиск страны или кода..."
                              className="w-full text-sm px-3 py-2 rounded-lg bg-charcoal/5 text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          {/* List */}
                          <ul className="max-h-48 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                              <li className="px-3 py-3 text-sm text-charcoal/40 text-center">Не найдено</li>
                            ) : filtered.map(c => (
                              <li key={c.code}>
                                <button
                                  type="button"
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-primary/8 transition-colors text-left ${selectedCountry?.code === c.code ? "bg-primary/10 text-primary font-medium" : "text-charcoal"}`}
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setDropdownOpen(false);
                                    setSearch("");
                                  }}
                                >
                                  <span className="text-lg leading-none w-6 text-center">{c.flag}</span>
                                  <span className="flex-1 truncate">{c.name}</span>
                                  <span className="text-charcoal/40 font-mono text-xs">{c.dial}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Number input */}
                    <input
                      id="modal-phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/[^\d\s\-()]/g, ""))}
                      placeholder="999 123 45 67"
                      className="flex-1 text-[16px] px-4 py-3 text-charcoal placeholder:text-charcoal/35 focus:outline-none bg-transparent rounded-r-lg min-w-0"
                    />
                  </div>
                </div>

                {selectedCountry?.dial === "+7" && (
                  <div className="text-sm text-charcoal/60 font-sans bg-charcoal/5 rounded-lg px-3 py-2.5 leading-relaxed flex flex-col gap-2">
                    <p>
                      Оплата картой РФ →{" "}
                      <a href="https://boosty.to/kristar.kristina" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">
                        Купить на Boosty
                      </a>
                    </p>
                    <p>
                      Если возникли вопросы — напишите в директ{" "}
                      <a href="https://instagram.com/kristar.kristina" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">
                        @kristar.kristina
                      </a>
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <div className="flex items-center justify-between bg-primary/8 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white text-xs font-bold font-sans uppercase tracking-widest px-2.5 py-1 rounded-full">
                      Скидка
                    </span>
                    <span className="line-through text-charcoal/35 text-base font-sans">{APP_CONFIG.priceOriginal}</span>
                  </div>
                  <span className="text-primary text-3xl font-bold font-sans">{APP_CONFIG.price}</span>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative bg-primary text-white font-bold py-4 px-10 rounded-full text-base tracking-wide overflow-hidden disabled:opacity-70 shadow-[0_4px_24px_rgba(161,36,91,0.4)] hover:shadow-[0_6px_32px_rgba(161,36,91,0.6)] transition-shadow"
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
