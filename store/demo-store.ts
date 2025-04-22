import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DemoStep = 
  | 'welcome'
  | 'categories'
  | 'workers'
  | 'jobs'
  | 'chat'
  | 'profile'
  | 'post-job'
  | 'complete';

interface DemoState {
  isDemoMode: boolean;
  currentStep: DemoStep;
  completedSteps: DemoStep[];
  isFirstTime: boolean;
  isFirstLaunch: boolean;
  
  // Actions
  toggleDemoMode: () => void;
  setCurrentStep: (step: DemoStep) => void;
  completeStep: (step: DemoStep) => void;
  resetDemo: () => void;
  setFirstTimeCompleted: () => void;
  setIsFirstLaunch: (value: boolean) => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      currentStep: 'welcome',
      completedSteps: [],
      isFirstTime: true,
      isFirstLaunch: true,
      
      toggleDemoMode: () => set((state) => ({ 
        isDemoMode: !state.isDemoMode,
        currentStep: !state.isDemoMode ? 'welcome' : state.currentStep
      })),
      
      setCurrentStep: (step: DemoStep) => set({ currentStep: step }),
      
      completeStep: (step: DemoStep) => set((state) => ({
        completedSteps: [...state.completedSteps.filter(s => s !== step), step],
        currentStep: getNextStep(step, state.completedSteps)
      })),
      
      resetDemo: () => set({
        currentStep: 'welcome',
        completedSteps: []
      }),
      
      setFirstTimeCompleted: () => set({ isFirstTime: false }),
      
      setIsFirstLaunch: (value) => set({ isFirstLaunch: value })
    }),
    {
      name: 'demo-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

// Helper function to determine the next step in the demo
function getNextStep(currentStep: DemoStep, completedSteps: DemoStep[]): DemoStep {
  const steps: DemoStep[] = [
    'welcome',
    'categories',
    'workers',
    'jobs',
    'chat',
    'profile',
    'post-job',
    'complete'
  ];
  
  const currentIndex = steps.indexOf(currentStep);
  
  // If we're at the last step or something went wrong, return 'complete'
  if (currentIndex === -1 || currentIndex >= steps.length - 1) {
    return 'complete';
  }
  
  // Return the next step
  return steps[currentIndex + 1];
}