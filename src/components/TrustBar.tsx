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
          <div
            key={stat.value}
            className="flex flex-col items-center text-center px-6"
            data-animate="fade-up"
            data-delay={String(i + 1)}
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-primary leading-none mb-2">
              {stat.value}
            </span>
            <span className="text-white/70 text-sm tracking-wider uppercase font-sans">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
