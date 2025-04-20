import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job, JobCategory, JobStatus, JobType } from '@/types/job';

interface JobState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchJobs: () => Promise<void>;
  getJobById: (id: string) => Job | undefined;
  getJobsByCategory: (category: JobCategory) => Job[];
  getJobsByStatus: (status: JobStatus) => Job[];
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateJobStatus: (id: string, status: JobStatus) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
}

// Mock data for jobs
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Electrical Wiring Repair',
    description: 'Need an electrician to fix wiring issues in a 2BHK apartment. Some switches not working and frequent power trips.',
    category: 'Electrician',
    jobType: 'Personal',
    status: 'open',
    location: {
      address: 'Andheri East, Mumbai',
      latitude: 19.1136,
      longitude: 72.8697
    },
    createdAt: '2023-05-15T10:30:00Z',
    expiresAt: '2023-06-15T10:30:00Z',
    fare: 1500,
    duration: '3-4 hours',
    vehicleRequired: 'Bike',
    applicationsCount: 5,
    isSurging: false
  },
  {
    id: '2',
    title: 'Elderly Care Assistant',
    description: 'Looking for a caregiver for my 75-year-old mother. Need assistance with medication, meals, and general companionship.',
    category: 'Caregiving',
    jobType: 'Personal',
    status: 'open',
    location: {
      address: 'Bandra West, Mumbai',
      latitude: 19.0596,
      longitude: 72.8295
    },
    createdAt: '2023-05-18T14:45:00Z',
    expiresAt: '2023-06-18T14:45:00Z',
    fare: 800,
    duration: 'Daily, 4 hours',
    vehicleRequired: 'Car',
    applicationsCount: 3,
    isSurging: false
  },
  {
    id: '3',
    title: 'Grocery Delivery',
    description: 'Need someone to pick up groceries from D-Mart and deliver to my home. List will be provided.',
    category: 'Delivery',
    jobType: 'Personal',
    status: 'assigned',
    location: {
      address: 'Powai, Mumbai',
      latitude: 19.1176,
      longitude: 72.9060
    },
    createdAt: '2023-05-20T09:15:00Z',
    expiresAt: '2023-05-21T09:15:00Z',
    fare: 300,
    duration: '1-2 hours',
    vehicleRequired: 'Bike',
    applicationsCount: 8,
    isSurging: false
  },
  {
    id: '4',
    title: 'Garden Maintenance',
    description: 'Need a gardener for regular maintenance of home garden. Tasks include pruning, watering, and pest control.',
    category: 'Gardening',
    jobType: 'Personal',
    status: 'open',
    location: {
      address: 'Juhu, Mumbai',
      latitude: 19.1075,
      longitude: 72.8263
    },
    createdAt: '2023-05-22T16:30:00Z',
    expiresAt: '2023-06-22T16:30:00Z',
    fare: 600,
    duration: 'Weekly, 2 hours',
    vehicleRequired: 'Bike',
    applicationsCount: 2,
    isSurging: false
  },
  {
    id: '5',
    title: 'Office Renovation',
    description: 'Looking for skilled carpenters and painters for office renovation. Work includes partitioning, furniture assembly, and painting.',
    category: 'Construction',
    jobType: 'Commercial',
    status: 'open',
    location: {
      address: 'Dadar, Mumbai',
      latitude: 19.0178,
      longitude: 72.8478
    },
    createdAt: '2023-05-25T11:00:00Z',
    expiresAt: '2023-06-25T11:00:00Z',
    fare: 25000,
    duration: '1 week',
    vehicleRequired: 'Truck',
    applicationsCount: 6,
    isSurging: true,
    companyName: 'TechSolutions Pvt Ltd'
  },
  {
    id: '6',
    title: 'Computer Network Setup',
    description: 'Need IT professional to set up network for a small office of 10 computers. Includes router configuration and cable management.',
    category: 'IT',
    jobType: 'Commercial',
    status: 'open',
    location: {
      address: 'Goregaon, Mumbai',
      latitude: 19.1663,
      longitude: 72.8526
    },
    createdAt: '2023-05-28T13:20:00Z',
    expiresAt: '2023-06-28T13:20:00Z',
    fare: 8000,
    duration: '1-2 days',
    vehicleRequired: 'Car',
    applicationsCount: 4,
    isSurging: false,
    companyName: 'DataSystems Inc.'
  },
  {
    id: '7',
    title: 'Catering for Office Event',
    description: 'Looking for catering service for office party of 50 people. Need variety of snacks, main course, and desserts.',
    category: 'Food',
    jobType: 'Commercial',
    status: 'completed',
    location: {
      address: 'Malad, Mumbai',
      latitude: 19.1872,
      longitude: 72.8484
    },
    createdAt: '2023-05-10T15:45:00Z',
    expiresAt: '2023-05-15T15:45:00Z',
    fare: 15000,
    duration: '1 day event',
    vehicleRequired: 'Van',
    applicationsCount: 10,
    isSurging: false,
    companyName: 'GlobalTech Solutions'
  },
  {
    id: '8',
    title: 'Security Guard for Event',
    description: 'Need security personnel for a corporate event. Must have experience in crowd management and emergency protocols.',
    category: 'Security',
    jobType: 'Commercial',
    status: 'open',
    location: {
      address: 'Chembur, Mumbai',
      latitude: 19.0522,
      longitude: 72.9005
    },
    createdAt: '2023-05-30T10:00:00Z',
    expiresAt: '2023-06-10T10:00:00Z',
    fare: 2000,
    duration: '1 day, 8 hours',
    vehicleRequired: 'Car',
    applicationsCount: 7,
    isSurging: true,
    companyName: 'EventPro Services'
  },
  {
    id: '9',
    title: 'Plumbing Repairs for Government Building',
    description: 'Seeking licensed plumber for repairs in government office building. Work includes fixing leaks, replacing pipes, and unclogging drains.',
    category: 'Plumbing',
    jobType: 'Government',
    status: 'open',
    location: {
      address: 'Fort, Mumbai',
      latitude: 18.9345,
      longitude: 72.8352
    },
    createdAt: '2023-06-01T09:30:00Z',
    expiresAt: '2023-07-01T09:30:00Z',
    fare: 12000,
    duration: '3-4 days',
    vehicleRequired: 'Van',
    applicationsCount: 3,
    isSurging: false,
    companyName: 'Municipal Corporation of Greater Mumbai'
  },
  {
    id: '10',
    title: 'IT Support for School Computers',
    description: 'Need IT technician to maintain and repair computers in a government school. Includes software updates, hardware repairs, and network troubleshooting.',
    category: 'IT',
    jobType: 'Government',
    status: 'open',
    location: {
      address: 'Worli, Mumbai',
      latitude: 19.0096,
      longitude: 72.8175
    },
    createdAt: '2023-06-02T11:15:00Z',
    expiresAt: '2023-07-02T11:15:00Z',
    fare: 5000,
    duration: 'Weekly, 4 hours',
    vehicleRequired: 'Car',
    applicationsCount: 2,
    isSurging: false,
    companyName: 'Department of Education'
  }
];

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: mockJobs,
      isLoading: false,
      error: null,
      
      fetchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just simulate a delay and return mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ jobs: mockJobs, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      getJobById: (id: string) => {
        return get().jobs.find(job => job.id === id);
      },
      
      getJobsByCategory: (category: JobCategory) => {
        return get().jobs.filter(job => job.category === category);
      },
      
      getJobsByStatus: (status: JobStatus) => {
        return get().jobs.filter(job => job.status === status);
      },
      
      createJob: async (job: Omit<Job, 'id' | 'createdAt' | 'status'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newJob: Job = {
            ...job,
            id: `${get().jobs.length + 1}`,
            createdAt: new Date().toISOString(),
            status: 'open'
          };
          
          set(state => ({
            jobs: [newJob, ...state.jobs],
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      updateJobStatus: async (id: string, status: JobStatus) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            jobs: state.jobs.map(job => 
              job.id === id ? { ...job, status } : job
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      applyToJob: async (jobId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set(state => ({
            jobs: state.jobs.map(job => 
              job.id === jobId ? { 
                ...job, 
                applicationsCount: (job.applicationsCount || 0) + 1 
              } : job
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      }
    }),
    {
      name: 'job-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);