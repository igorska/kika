import BuyButton from "./BuyButton";

export default function CtaSection() {
  return (
    <section className="bg-[#EFEFEF] py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Готовы собрать идеальную косметичку?
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-8">
          Получите гайд с проверенными продуктами и профессиональными советами
        </p>
        <BuyButton />
      </div>
    </section>
  );
}
