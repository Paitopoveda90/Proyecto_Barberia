
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import videoHome from '../assets/videos/Video_Home.mp4';

// Importa las imágenes de los servicios
import corteImg from '../assets/img/corte.jpg';
import barbaImg from '../assets/img/barba.jpg';
import afeitadoImg from '../assets/img/afeitado.jpg';
import comboImg from '../assets/img/combo.jpg';

export default function Home() {
  const navigate = useNavigate();

  const services = [
    { id: 1, title: 'Corte Clásico', img: corteImg },
    { id: 2, title: 'Barba Premium', img: barbaImg },
    { id: 3, title: 'Afeitado Tradicional', img: afeitadoImg },
    { id: 4, title: 'Combo Full Style', img: comboImg }
  ];

  return (
    <>

      {/* HERO */}
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoHome} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        <div className="hero-overlay">
          <h1>Hacha y Barba</h1>
          <h2>Forjando tu mejor estilo</h2>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services container">
        <h3>Servicios principales</h3>

        <div className="services-grid">
          {services.map(service => (
            <div className="service-card" key={service.id}>
              <img
                src={service.img}
                alt={service.title}
                className="service-img"
                style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
              />
              <h4>{service.title}</h4>
              <button onClick={() => navigate('/book')}>
                Revisar Agenda
              </button>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
