import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';


const Login = () => {
  const { login, loading, error, token, user, checkAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  // 1. Al cargar, validamos el token si existe
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        await checkAuth();
      }
      // Siempre marcamos como terminado la verificación
      setIsChecking(false);
    };
    validateToken();
  }, [checkAuth]);

  // 2. Redirigir según el rol del usuario después de la validación
  useEffect(() => {
    if (!isChecking && token && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [token, user, isChecking, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    // Si el login fue exitoso, el token y user se actualizarán y el useEffect redirigirá automáticamente
    // La redirección se maneja en el useEffect que observa token y user
  };

  // 3. Mostrar loading mientras validamos el token
  if (isChecking) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // 4. Si hay un token válido, no renderizamos el HTML del login
  if (token) return null;

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Bienvenido</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
        </form>
        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;