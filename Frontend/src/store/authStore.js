import { create } from 'zustand';
import api from '../services/api';

// Store de autenticación: maneja login, registro y estado del usuario
export const useAuthStore = create((set) => ({
  user: null, // Usuario autenticado
  token: localStorage.getItem('token'), // Token JWT
  loading: false, // Estado de carga
  error: null, // Mensaje de error

  // Valida el token guardado al arrancar la app
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false, token: null, user: null });
      return;
    }
    set({ loading: true });
    try {
      const res = await api.get('/auth/me'); 
      set({ user: res.data.user, token: token, loading: false, error: null });
    } catch {
      // Si el token expiró o es inválido, limpiamos todo
      localStorage.removeItem('token');
      set({ token: null, user: null, loading: false, error: null });
    }
  },

  // Iniciar sesión
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log("Respuesta del servidor:", res.data);
      // IMPORTANTE: Verifica qué devuelve tu API. 
      // Si tu API devuelve { token: "...", data: { name: "..." } }, 
      // debes usar res.data.data
      const token = res.data.token || res.data.data?.token;
      const user = res.data.user || res.data.data?.user || { id: 'unknown' }; // Forzamos un objeto si no viene

      if (token) {
        localStorage.setItem('token', token);
        set({
          token: token,
          user: user,
          loading: false // <--- IMPORTANTE: Detenemos el cargando
        });
      } else {
        throw new Error("No se recibió un token del servidor");
      }

    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Error login',
        loading: false // <--- IMPORTANTE: Si hay error, liberamos el botón
      });
    }
  },

  // Registrar nuevo usuario
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);

      localStorage.setItem('token', res.data.token);

      set({
        user: res.data.user,
        token: res.data.token,
        loading: false
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error registro',
        loading: false
      });
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, loading: false });
  }
}));
