import { create } from 'zustand';

interface DemoState {
  isDemoMode: boolean;
  isLoading: boolean;
  error: string | null;
}

interface DemoActions {
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
  setError: (error: string | null) => void;
}

export const useDemoStore = create<DemoState & DemoActions>((set) => ({
  isDemoMode: false,
  isLoading: false,
  error: null,

  setDemoMode: (enabled) => set({ isDemoMode: enabled }),
  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
  setError: (error) => set({ error })
})); 