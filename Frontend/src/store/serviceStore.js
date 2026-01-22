import { create } from 'zustand';
import api from '../services/api';

export const useServiceStore = create((set) => ({
  services: [],

  fetchServices: async () => {
    const res = await api.get('/services');
    set({ services: res.data });
  }
}));
