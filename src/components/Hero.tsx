import Image from "next/image";
import BuyButton from "./BuyButton";

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="relative w-full" style={{ aspectRatio: "16/7", minHeight: 320 }}>
        <Image
          src="/header_1.jpg"
          alt="Как собрать идеальную косметичку"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-3xl">
            Как собрать идеальную косметичку?
          </h1>
          <p className="text-white text-base md:text-xl mb-8 max-w-xl leading-relaxed">
            Гайд о том, как собрать идеальную косметичку и не разориться на бесполезных банках
          </p>
          <BuyButton />
        </div>
      </div>
    </section>
  );
}
