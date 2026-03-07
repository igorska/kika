const chapters = [
  {
    number: "01",
    title: "Экономию времени и денег",
    description:
      "Я собрала лучшие средства в премиальном и более доступном сегментах",
  },
  {
    number: "02",
    title: "Как правильно выбрать косметику",
    description:
      "Базовые принципы подбора и техники нанесения",
  },
  {
    number: "03",
    title: "Всё, что нужно для идеальной косметички",
    description: "Полный список: от подготовки кожи до кистей",
  },
  {
    number: "04",
    title: "Подробное описание каждого продукта",
    description: "С фото и рекомендациями по применению",
  },
];

export default function Contents() {
  return (
    <section className="bg-charcoal section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <h2
          className="text-3xl md:text-5xl font-bold mb-12 text-center text-white"
          data-animate="fade-up"
          data-delay="1"
        >
          Что вы получите?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {chapters.map((ch, i) => (
            <div
              key={ch.number}
              className="group bg-white/8 border border-white/10 rounded-2xl p-6 cursor-default"
              data-animate="fade-up"
              data-delay={String(i + 1)}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
