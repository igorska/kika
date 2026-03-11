interface BuyButtonProps {
  label?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  source?: string;
}

export default function BuyButton({
  label = "Купить гайд",
  variant = "primary",
  onClick,
  source,
}: BuyButtonProps) {
  const base =
    "relative inline-block font-bold py-4 px-10 rounded-full text-base tracking-wide overflow-hidden cursor-pointer";

  const styles =
    variant === "ghost"
      ? "text-white border-2 border-white/60 hover:border-white"
      : "text-white bg-primary shadow-[0_4px_24px_rgba(232,58,124,0.45)] hover:shadow-[0_6px_32px_rgba(232,58,124,0.65)]";

  function handleClick() {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "click_buy_button", {
        event_category: "engagement",
        event_label: label,
        source: source ?? "unknown",
      });
    }
    onClick?.();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${styles} group transition-transform duration-150 hover:scale-[1.04] active:scale-[0.97]`}
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
    </button>
  );
}
