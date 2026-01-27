import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '../store/serviceStore';
import '../styles/home.css';
import videoHome from '../assets/videos/Video_Home.mp4';

// Importa las imágenes por defecto de los servicios (para usar como fallback)
import corteImg from '../assets/img/corte.jpg';
import barbaImg from '../assets/img/barba.jpg';
import afeitadoImg from '../assets/img/afeitado.jpg';
import comboImg from '../assets/img/combo.jpg';

// Array de imágenes por defecto para rotar entre servicios
const defaultImages = [corteImg, barbaImg, afeitadoImg, comboImg];

export default function Home() {
  const navigate = useNavigate();
  const { services, fetchServices } = useServiceStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  // Cargar servicios al montar el componente
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Función para obtener la imagen del servicio o una por defecto
  const getServiceImage = (service, index) => {
    // Si el servicio tiene una imagen_url, usarla
    if (service.image_url) {
      // Si es una URL relativa, construir la URL completa
      if (service.image_url.startsWith('/')) {
        return `http://localhost:4000${service.image_url}`;
      }
      return service.image_url;
    }
    // Si no tiene imagen, usar una por defecto
    return defaultImages[index % defaultImages.length];
  };

  // Calcular cuántas cards mostrar según el ancho de pantalla
  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 768) return 1; // Móvil: 1 card
    if (window.innerWidth < 1024) return 2; // Tablet: 2 cards
    if (window.innerWidth < 1280) return 3; // Escritorio pequeño: 3 cards
    return 4; // Escritorio: 4 cards
  };

  const [cardsPerView, setCardsPerView] = useState(() => getCardsPerView());

  // Calcular el porcentaje de transform según el número de cards visibles
  const getTransformPercentage = () => {
    return 100 / cardsPerView;
  };

  // Actualizar cards por vista al cambiar el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = getCardsPerView();
      if (newCardsPerView !== cardsPerView) {
        setCardsPerView(newCardsPerView);
        setCurrentIndex(0); // Resetear al cambiar tamaño
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardsPerView]);

  // Auto-play del carrusel
  useEffect(() => {
    if (services.length === 0) return;

    const maxIndex = Math.max(0, services.length);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Si llegamos al final, volver al inicio (el loop infinito se maneja con duplicatedServices)
        if (prevIndex >= maxIndex - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 5000); // Cambiar cada 5 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [services, cardsPerView]);

  // Duplicar servicios para crear un loop infinito suave
  const duplicatedServices = services.length > 0 
    ? [...services, ...services, ...services]
    : [];

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

        {services.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc', padding: '2rem' }}>
            No hay servicios disponibles en este momento
          </p>
        ) : (
          <div className="services-carousel-wrapper">
            <div 
              className="services-carousel" 
              ref={carouselRef}
              style={{
                transform: `translateX(-${currentIndex * getTransformPercentage()}%)`
              }}
            >
              {duplicatedServices.map((service, index) => (
                <div className="service-card" key={`${service.id}-${index}`}>
                  <div className="service-img-container">
                    <img
                      src={getServiceImage(service, index % services.length)}
                      alt={service.name}
                      className="service-img"
                      onError={(e) => {
                        // Si la imagen falla al cargar, usar una por defecto
                        e.target.src = defaultImages[(index % services.length) % defaultImages.length];
                      }}
                    />
                  </div>
                  <div className="service-content">
                    <h4>{service.name}</h4>
                    {service.description && (
                      <p className="service-description">
                        {service.description}
                      </p>
                    )}
                    <div className="service-info">
                      {service.duration && (
                        <span className="service-duration">
                          Duración: {service.duration} min
                        </span>
                      )}
                      {service.price && (
                        <span className="service-price">
                          Precio: ${service.price}
                        </span>
                      )}
                    </div>
                    <button onClick={() => navigate('/book')}>
                      Revisar Agenda
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    </>
  );
}
