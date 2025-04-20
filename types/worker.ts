export type WorkerCategory = 
  | 'Electrician'
  | 'Plumbing'
  | 'Delivery'
  | 'Shopping'
  | 'Personal'
  | 'Commercial'
  | 'Logistics'
  | 'Security'
  | 'Food'
  | 'Construction'
  | 'Carpentry'
  | 'Painting'
  | 'IT'
  | 'Networking'
  | 'Gardening'
  | 'Healthcare'
  | 'Caregiving'
  | 'Rideshare';

export type VehicleCategory = 'Car' | 'Truck' | 'Bus' | 'Van' | 'Bike' | 'Scooter';

export type WorkerStatus = 'available' | 'busy' | 'offline';

export interface WorkerLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface WorkerSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsOfExperience?: number;
}

export interface WorkerCertification {
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
}

export interface WorkerRating {
  overall: number;
  communication: number;
  professionalism: number;
  quality: number;
  timeliness: number;
  reviewCount: number;
}

export interface WorkerAvailability {
  days: string[];
  hours: string;
}

export interface Worker {
  id: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  categories: WorkerCategory[];
  skills: WorkerSkill[];
  status: WorkerStatus;
  location: WorkerLocation;
  radius?: number;
  rating: WorkerRating;
  completedJobs: number;
  memberSince: string;
  isVerified: boolean;
  phone?: string;
  vehicleType?: VehicleCategory;
  hourlyRate?: number;
  availability?: WorkerAvailability;
  languages?: string[];
  certifications?: WorkerCertification[];
}