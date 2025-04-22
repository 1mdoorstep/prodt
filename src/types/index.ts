export type VehicleType = 'car' | 'bike' | 'truck' | 'van';

export type SkillCategory = 
  | 'construction'
  | 'delivery'
  | 'cleaning'
  | 'maintenance'
  | 'moving'
  | 'painting'
  | 'other';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  salary: {
    min: number;
    max: number;
    type: 'hourly' | 'fixed';
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  employer: {
    id: string;
    name: string;
    rating: number;
  };
  requirements: {
    experience: number;
    skills: string[];
  };
  postedAt: Date;
  status: 'open' | 'in-progress' | 'completed';
} 