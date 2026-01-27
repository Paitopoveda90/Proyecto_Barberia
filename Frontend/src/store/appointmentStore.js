import { create } from 'zustand';
import api from '../services/api';

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  blockedDates: [],
  loading: false,
  error: null,

  createAppointment: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/appointments', data);
      // Recargar las citas después de crear
      await get().fetchMyAppointments();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear la cita';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  deleteAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/appointments/${id}`);
      // Actualizar la lista localmente
      set((state) => ({
        appointments: state.appointments.filter((appt) => appt.id !== id),
        loading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar la cita';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  fetchMyAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/appointments/me');
      set({ appointments: res.data, loading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar las citas';
      set({ appointments: [], loading: false, error: errorMessage });
    }
  },

  // Obtener fechas bloqueadas (público)
  fetchBlockedDates: async () => {
    try {
      const res = await api.get('/blocked-dates');
      set({ blockedDates: res.data || [] });
    } catch (err) {
      // Si falla, simplemente no hay fechas bloqueadas
      set({ blockedDates: [] });
    }
  }
}));
