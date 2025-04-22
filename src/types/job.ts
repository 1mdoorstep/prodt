export type JobStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type JobType = 'Personal' | 'Commercial' | 'Government';

export type JobCategory = 
  | 'Delivery'
  | 'Electrician'
  | 'Plumbing'
  | 'Carpentry'
  | 'Painting'
  | 'Personal'
  | 'Commercial'
  | 'Logistics'
  | 'Security'
  | 'Food'
  | 'Construction'
  | 'IT'
  | 'Networking'
  | 'Gardening'
  | 'Healthcare'
  | 'Caregiving'
  | 'Rideshare';

export interface JobLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  jobType: JobType;
  status: JobStatus;
  location: JobLocation;
  createdAt: string;
  expiresAt: string;
  fare?: number;
  duration?: string;
  vehicleRequired: 'Car' | 'Truck' | 'Bus' | 'Van' | 'Bike' | 'Scooter';
  applicationsCount?: number;
  isSurging?: boolean;
  companyName?: string;
}