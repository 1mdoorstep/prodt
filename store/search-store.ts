import { create } from 'zustand';
import { Job, SkillCategory } from '@/types';
import { apiClient } from '@/utils/api';

interface SearchState {
  searchTerm: string;
  category: SkillCategory | null;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  radius: number;
  results: Job[];
  isLoading: boolean;
  error: string | null;
}

interface SearchActions {
  setSearchTerm: (term: string) => void;
  setCategory: (category: SkillCategory | null) => void;
  setLocation: (location: SearchState['location']) => void;
  setRadius: (radius: number) => void;
  searchJobs: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
  searchTerm: '',
  category: null,
  location: null,
  radius: 10, // Default 10km radius
  results: [],
  isLoading: false,
  error: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setCategory: (category) => set({ category }),
  setLocation: (location) => set({ location }),
  setRadius: (radius) => set({ radius }),

  searchJobs: async () => {
    const { searchTerm, category, location, radius } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<{ data: Job[] }>('/api/jobs/search', {
        params: {
          q: searchTerm,
          category,
          lat: location?.lat,
          lng: location?.lng,
          radius
        }
      });
      
      set({ results: response.data.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search jobs',
        isLoading: false 
      });
    }
  },

  clearResults: () => set({ 
    results: [], 
    searchTerm: '', 
    category: null,
    error: null 
  })
})); 