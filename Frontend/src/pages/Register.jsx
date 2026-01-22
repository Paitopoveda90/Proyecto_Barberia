import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/register.css';

export default function Register() {
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      navigate('/dashboard');
    } catch {
      alert('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
    <div className="register-page">
      <div className="register-card">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="login-text">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
    </>
  );
}
