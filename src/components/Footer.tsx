export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      aria-label="Подвал сайта"
      className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500 font-sans"
    >
      <p>
        &copy; {year}{" "}
        <a href="/" className="hover:text-primary transition-colors">
          Кристина
        </a>
        . Все права защищены.
      </p>
    </footer>
  );
}
