import { create } from 'zustand';
import api from '../services/api';

export const useAdminStore = create((set, get) => ({
  users: [],
  appointments: [],
  blockedDates: [],
  loading: false,
  error: null,

  // Usuarios con citas
  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/admin/users');
      set({ users: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al cargar usuarios', loading: false });
    }
  },

  // Todas las citas
  fetchAllAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/admin/appointments');
      set({ appointments: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al cargar citas', loading: false });
    }
  },

  // Cancelar cita
  cancelAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/admin/appointments/${id}/cancel`);
      await get().fetchAllAppointments();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cancelar la cita';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fechas bloqueadas
  fetchBlockedDates: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/admin/blocked-dates');
      set({ blockedDates: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error al cargar fechas bloqueadas', loading: false });
    }
  },

  blockDate: async (date, time = null, reason = null) => {
    set({ loading: true, error: null });
    try {
      await api.post('/admin/blocked-dates', { date, time, reason });
      await get().fetchBlockedDates();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al bloquear fecha';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  unblockDate: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/admin/blocked-dates/${id}`);
      await get().fetchBlockedDates();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al desbloquear fecha';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Servicios
  createService: async (serviceData) => {
    set({ loading: true, error: null });
    try {
      await api.post('/admin/services', serviceData);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear servicio';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  updateService: async (id, serviceData) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/admin/services/${id}`, serviceData);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar servicio';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  deleteService: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/admin/services/${id}`);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar servicio';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  }
}));
