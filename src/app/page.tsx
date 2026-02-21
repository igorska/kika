import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import AboutGuide from "@/components/AboutGuide";
import Contents from "@/components/Contents";
import AboutAuthor from "@/components/AboutAuthor";
import CtaSection from "@/components/CtaSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <AboutGuide />
      <Contents />
      <AboutAuthor />
      <CtaSection />
    </main>
  );
}
