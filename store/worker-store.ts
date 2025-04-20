import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Worker, WorkerCategory, VehicleCategory } from '@/types/worker';

interface WorkerState {
  workers: Worker[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWorkers: () => Promise<void>;
  getWorkerById: (id: string) => Worker | undefined;
  getWorkersByCategory: (category: WorkerCategory) => Worker[];
  getTopRatedWorkers: (limit?: number) => Worker[];
  updateWorkerStatus: (id: string, status: 'available' | 'busy' | 'offline') => Promise<void>;
}

// Mock data for workers
const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Electrician', 'Plumbing'],
    skills: [
      { name: 'Electrical Wiring', level: 'expert', yearsOfExperience: 5 },
      { name: 'Circuit Installation', level: 'expert', yearsOfExperience: 4 },
      { name: 'Plumbing Repairs', level: 'intermediate', yearsOfExperience: 2 }
    ],
    status: 'available',
    location: {
      address: 'Andheri East, Mumbai',
      latitude: 19.1136,
      longitude: 72.8697
    },
    radius: 5,
    rating: {
      overall: 4.8,
      communication: 4.7,
      professionalism: 4.9,
      quality: 4.8,
      timeliness: 4.7,
      reviewCount: 124
    },
    completedJobs: 156,
    memberSince: '2020-03-15',
    isVerified: true,
    phone: '+919876543210',
    vehicleType: 'Bike',
    hourlyRate: 500,
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      hours: '9:00 AM - 6:00 PM'
    },
    languages: ['Hindi', 'English', 'Marathi'],
    certifications: [
      {
        name: 'Certified Electrician',
        issuedBy: 'Mumbai Electrical Association',
        issuedDate: '2019-05-10',
        expiryDate: '2024-05-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Priya Singh',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Caregiving', 'Healthcare'],
    skills: [
      { name: 'Elderly Care', level: 'expert', yearsOfExperience: 7 },
      { name: 'First Aid', level: 'expert', yearsOfExperience: 8 },
      { name: 'Medication Management', level: 'expert', yearsOfExperience: 6 }
    ],
    status: 'busy',
    location: {
      address: 'Bandra West, Mumbai',
      latitude: 19.0596,
      longitude: 72.8295
    },
    radius: 8,
    rating: {
      overall: 4.9,
      communication: 5.0,
      professionalism: 4.9,
      quality: 4.8,
      timeliness: 4.9,
      reviewCount: 87
    },
    completedJobs: 92,
    memberSince: '2021-01-10',
    isVerified: true,
    phone: '+919876543211',
    hourlyRate: 600,
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      hours: '8:00 AM - 4:00 PM'
    },
    languages: ['Hindi', 'English', 'Punjabi'],
    certifications: [
      {
        name: 'Certified Nursing Assistant',
        issuedBy: 'Mumbai Medical Association',
        issuedDate: '2018-03-15',
        expiryDate: '2023-03-15'
      }
    ]
  },
  {
    id: '3',
    name: 'Amit Patel',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Delivery', 'Logistics', 'Rideshare'],
    skills: [
      { name: 'Package Delivery', level: 'expert', yearsOfExperience: 4 },
      { name: 'Route Optimization', level: 'intermediate', yearsOfExperience: 3 },
      { name: 'Customer Service', level: 'expert', yearsOfExperience: 5 }
    ],
    status: 'available',
    location: {
      address: 'Powai, Mumbai',
      latitude: 19.1176,
      longitude: 72.9060
    },
    radius: 15,
    rating: {
      overall: 4.6,
      communication: 4.5,
      professionalism: 4.7,
      quality: 4.6,
      timeliness: 4.7,
      reviewCount: 203
    },
    completedJobs: 245,
    memberSince: '2019-08-22',
    isVerified: true,
    phone: '+919876543212',
    vehicleType: 'Bike',
    hourlyRate: 300,
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      hours: '10:00 AM - 10:00 PM'
    },
    languages: ['Hindi', 'English', 'Gujarati']
  },
  {
    id: '4',
    name: 'Sunita Sharma',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Gardening', 'Painting'],
    skills: [
      { name: 'Garden Maintenance', level: 'expert', yearsOfExperience: 10 },
      { name: 'Plant Care', level: 'expert', yearsOfExperience: 12 },
      { name: 'Interior Painting', level: 'intermediate', yearsOfExperience: 4 }
    ],
    status: 'offline',
    location: {
      address: 'Juhu, Mumbai',
      latitude: 19.1075,
      longitude: 72.8263
    },
    radius: 6,
    rating: {
      overall: 4.7,
      communication: 4.6,
      professionalism: 4.8,
      quality: 4.9,
      timeliness: 4.5,
      reviewCount: 56
    },
    completedJobs: 68,
    memberSince: '2021-05-30',
    isVerified: false,
    phone: '+919876543213',
    hourlyRate: 450,
    availability: {
      days: ['mon', 'wed', 'fri'],
      hours: '9:00 AM - 5:00 PM'
    },
    languages: ['Hindi', 'English']
  },
  {
    id: '5',
    name: 'Mohammed Khan',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Construction', 'Carpentry'],
    skills: [
      { name: 'Building Construction', level: 'expert', yearsOfExperience: 15 },
      { name: 'Furniture Making', level: 'expert', yearsOfExperience: 12 },
      { name: 'Woodworking', level: 'expert', yearsOfExperience: 14 }
    ],
    status: 'available',
    location: {
      address: 'Dadar, Mumbai',
      latitude: 19.0178,
      longitude: 72.8478
    },
    radius: 10,
    rating: {
      overall: 4.9,
      communication: 4.8,
      professionalism: 5.0,
      quality: 4.9,
      timeliness: 4.8,
      reviewCount: 178
    },
    completedJobs: 210,
    memberSince: '2018-02-14',
    isVerified: true,
    phone: '+919876543214',
    vehicleType: 'Truck',
    hourlyRate: 800,
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      hours: '8:00 AM - 7:00 PM'
    },
    languages: ['Hindi', 'English', 'Urdu'],
    certifications: [
      {
        name: 'Master Carpenter',
        issuedBy: 'Indian Construction Association',
        issuedDate: '2015-07-20'
      }
    ]
  },
  {
    id: '6',
    name: 'Vikram Malhotra',
    profilePicture: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['IT', 'Networking'],
    skills: [
      { name: 'Computer Repair', level: 'expert', yearsOfExperience: 8 },
      { name: 'Network Setup', level: 'expert', yearsOfExperience: 7 },
      { name: 'Software Installation', level: 'expert', yearsOfExperience: 9 }
    ],
    status: 'busy',
    location: {
      address: 'Goregaon, Mumbai',
      latitude: 19.1663,
      longitude: 72.8526
    },
    radius: 12,
    rating: {
      overall: 4.8,
      communication: 4.7,
      professionalism: 4.9,
      quality: 4.8,
      timeliness: 4.7,
      reviewCount: 134
    },
    completedJobs: 156,
    memberSince: '2019-11-05',
    isVerified: true,
    phone: '+919876543215',
    vehicleType: 'Car',
    hourlyRate: 900,
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      hours: '10:00 AM - 8:00 PM'
    },
    languages: ['Hindi', 'English'],
    certifications: [
      {
        name: 'CompTIA A+',
        issuedBy: 'CompTIA',
        issuedDate: '2018-09-12',
        expiryDate: '2024-09-12'
      },
      {
        name: 'Cisco Certified Network Associate',
        issuedBy: 'Cisco',
        issuedDate: '2019-03-25',
        expiryDate: '2023-03-25'
      }
    ]
  },
  {
    id: '7',
    name: 'Ananya Desai',
    profilePicture: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Food', 'Shopping'],
    skills: [
      { name: 'Cooking', level: 'expert', yearsOfExperience: 6 },
      { name: 'Grocery Shopping', level: 'expert', yearsOfExperience: 4 },
      { name: 'Meal Planning', level: 'intermediate', yearsOfExperience: 3 }
    ],
    status: 'available',
    location: {
      address: 'Malad, Mumbai',
      latitude: 19.1872,
      longitude: 72.8484
    },
    radius: 7,
    rating: {
      overall: 4.7,
      communication: 4.8,
      professionalism: 4.7,
      quality: 4.9,
      timeliness: 4.5,
      reviewCount: 89
    },
    completedJobs: 102,
    memberSince: '2020-08-15',
    isVerified: true,
    phone: '+919876543216',
    vehicleType: 'Scooter',
    hourlyRate: 550,
    availability: {
      days: ['tue', 'wed', 'thu', 'fri', 'sat'],
      hours: '11:00 AM - 7:00 PM'
    },
    languages: ['Hindi', 'English', 'Marathi', 'Gujarati']
  },
  {
    id: '8',
    name: 'Ravi Verma',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    categories: ['Security', 'Personal'],
    skills: [
      { name: 'Security Services', level: 'expert', yearsOfExperience: 12 },
      { name: 'Personal Protection', level: 'expert', yearsOfExperience: 10 },
      { name: 'Surveillance', level: 'expert', yearsOfExperience: 11 }
    ],
    status: 'offline',
    location: {
      address: 'Chembur, Mumbai',
      latitude: 19.0522,
      longitude: 72.9005
    },
    radius: 20,
    rating: {
      overall: 4.9,
      communication: 4.8,
      professionalism: 5.0,
      quality: 4.9,
      timeliness: 4.9,
      reviewCount: 67
    },
    completedJobs: 78,
    memberSince: '2019-05-20',
    isVerified: true,
    phone: '+919876543217',
    vehicleType: 'Car',
    hourlyRate: 1200,
    availability: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      hours: '24 hours'
    },
    languages: ['Hindi', 'English'],
    certifications: [
      {
        name: 'Certified Security Professional',
        issuedBy: 'Indian Security Association',
        issuedDate: '2017-11-30',
        expiryDate: '2023-11-30'
      }
    ]
  }
];

export const useWorkerStore = create<WorkerState>()(
  persist(
    (set, get) => ({
      workers: mockWorkers,
      isLoading: false,
      error: null,
      
      fetchWorkers: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just simulate a delay and return mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ workers: mockWorkers, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      getWorkerById: (id: string) => {
        return get().workers.find(worker => worker.id === id);
      },
      
      getWorkersByCategory: (category: WorkerCategory) => {
        return get().workers.filter(worker => 
          worker.categories.includes(category)
        );
      },
      
      getTopRatedWorkers: (limit = 10) => {
        return [...get().workers]
          .sort((a, b) => b.rating.overall - a.rating.overall)
          .slice(0, limit);
      },
      
      updateWorkerStatus: async (id: string, status: 'available' | 'busy' | 'offline') => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            workers: state.workers.map(worker => 
              worker.id === id ? { ...worker, status } : worker
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      }
    }),
    {
      name: 'worker-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);