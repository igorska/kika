export default function AboutAuthor() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Об авторе</h2>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-40 h-40 rounded-full bg-[#EFEFEF] flex items-center justify-center text-gray-400 text-sm">
              Фото
            </div>
          </div>
          <div className="flex-1 space-y-4 text-base leading-relaxed">
            <p>Привет, меня зовут Кристина.</p>
            <p>Я профессиональный визажист.</p>
            <p>
              За 6 лет в Калифорнии я протестировала тысячи текстур и точно знаю, как собрать идеальную косметичку.
            </p>
            <p>
              Я работала с разными типами кожи, разными возрастами и запросами от лёгкого ежедневного макияжа до съёмок и особых событий. Поэтому в этом гайде нет случайных средств.
            </p>
            <p>Здесь только проверенные продукты, которые:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>красиво выглядят на коже;</li>
              <li>легко наносятся и тушуются;</li>
              <li>подходят под разные бюджеты;</li>
              <li>и действительно стоят своих денег.</li>
            </ul>
            <p>Я собрала не просто список покупок, а систему как выбирать и как этим пользоваться.</p>
            <p>Этот гайд — результат моего опыта, ошибок, тестов и реальной работы.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
