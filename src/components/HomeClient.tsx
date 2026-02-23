"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import AboutGuide from "@/components/AboutGuide";
import Contents from "@/components/Contents";
import AboutAuthor from "@/components/AboutAuthor";
import CtaSection from "@/components/CtaSection";

const CheckoutModal = dynamic(() => import("@/components/CheckoutModal"), { ssr: false });

export default function HomeClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  return (
    <main>
      <Hero onBuyClick={openModal} />
      <TrustBar />
      <AboutGuide onBuyClick={openModal} />
      <Contents />
      <AboutAuthor />
      <CtaSection onBuyClick={openModal} />
      <CheckoutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
