export default function BuyButton({ label = "Купить гайд" }: { label?: string }) {
  return (
    <a
      href="#"
      className="inline-block bg-primary text-white font-bold py-4 px-10 rounded hover:opacity-90 transition-opacity text-base tracking-wide"
    >
      {label}
    </a>
  );
}
