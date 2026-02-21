const chapters = [
  {
    number: "01",
    title: "Средства в двух бюджетах",
    description: "В каждой категории — варианты в более доступном и более премиальном сегменте",
  },
  {
    number: "02",
    title: "База знаний по выбору и нанесению",
    description: "Описаны базовые принципы подбора косметики и техники её нанесения",
  },
  {
    number: "03",
    title: "Полный набор средств",
    description: "От тоника до кистей — всё, что нужно для идеальной косметички",
  },
  {
    number: "04",
    title: "Подробное описание каждого продукта",
    description: "С фото и рекомендациями по применению",
  },
];

export default function Contents() {
  return (
    <section className="bg-[#EFEFEF] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Что внутри</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((ch) => (
            <div key={ch.number} className="bg-white p-6 rounded">
              <span className="text-primary font-bold text-sm">{ch.number}</span>
              <h3 className="font-bold text-lg mt-1 mb-2">{ch.title}</h3>
              <p className="text-sm leading-relaxed text-gray-700">{ch.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
