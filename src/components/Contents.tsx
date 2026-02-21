const chapters = [
  {
    number: "01",
    title: "Основы базы",
    description: "Как выбрать тональную основу, BB-крем и консилер под свой тон кожи",
  },
  {
    number: "02",
    title: "Уход и подготовка кожи",
    description: "Праймеры, увлажняющие средства и подготовка кожи к макияжу",
  },
  {
    number: "03",
    title: "Глаза и брови",
    description: "Тени, подводка, тушь и карандаши — что действительно нужно",
  },
  {
    number: "04",
    title: "Губы и щёки",
    description: "Помады, блески, румяна и хайлайтеры на любой бюджет",
  },
  {
    number: "05",
    title: "Люкс vs бюджет",
    description: "Сравнение средств: где стоит потратиться, а где сэкономить",
  },
  {
    number: "06",
    title: "Финальная косметичка",
    description: "Готовый список продуктов для идеальной базовой косметички",
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
