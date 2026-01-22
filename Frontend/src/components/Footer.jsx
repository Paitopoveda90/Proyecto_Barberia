import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Hacha y Barba — Todos los derechos reservados</p>
    </footer>
  );
}
