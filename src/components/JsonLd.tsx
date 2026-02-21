const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Гайд Кристины",
  url: base,
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Гайд: Как собрать идеальную косметичку",
  description:
    "Авторский гайд визажиста с 6-летним опытом: как собрать косметичку, какую косметику выбрать и не разориться на ненужных средствах.",
  image: `${base}/header_1.jpg`,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "RUB",
    url: base,
  },
  author: {
    "@type": "Person",
    name: "Кристина",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Кристина",
  jobTitle: "Визажист",
  image: `${base}/author.jpg`,
  description: "Профессиональный визажист с 6-летним опытом",
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
