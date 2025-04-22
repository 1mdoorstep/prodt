import { create } from 'zustand';
import { apiClient } from '@/utils/api';
import { VehicleType } from '@/types';

interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  documents: {
    rc: string;
    insurance: string;
    pollution: string;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  selectVehicle: (id: string) => void;
  clearError: () => void;
}

export const useVehicleStore = create<VehicleState>()((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<Vehicle[]>('/vehicles');
      set({
        vehicles: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vehicles',
        isLoading: false,
      });
    }
  },

  addVehicle: async (vehicle) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post<Vehicle>('/vehicles', vehicle);
      set((state) => ({
        vehicles: [...state.vehicles, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add vehicle',
        isLoading: false,
      });
    }
  },

  updateVehicle: async (id, vehicle) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, vehicle);
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === id ? response.data : v
        ),
        selectedVehicle: state.selectedVehicle?.id === id ? response.data : state.selectedVehicle,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update vehicle',
        isLoading: false,
      });
    }
  },

  deleteVehicle: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.delete(`/vehicles/${id}`);
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
        selectedVehicle: state.selectedVehicle?.id === id ? null : state.selectedVehicle,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete vehicle',
        isLoading: false,
      });
    }
  },

  selectVehicle: (id) => {
    const vehicle = get().vehicles.find((v) => v.id === id);
    set({ selectedVehicle: vehicle || null });
  },

  clearError: () => set({ error: null }),
})); 