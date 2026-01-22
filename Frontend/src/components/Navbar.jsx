import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/img/LOGO_BARBA.png';

// Navbar muestra botones solo si no está en /admin
export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Hacha y Barba Logo" className="logo-img"  /> Hacha y Barba
          
        </Link>
      </div>
      {!isAdmin && (
        <ul>
          <li><Link to="/login">Ingresar</Link></li>
        </ul>
      )}
    </nav>
  );
}
