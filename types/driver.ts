export type VehicleCategory = 'Car' | 'Truck' | 'Bus' | 'Van' | 'Bike';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface DriverAvailability {
  id: string;
  driverId: string;
  startTime: string;
  endTime: string;
  location: Location;
  isActive: boolean;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  profilePicture?: string;
  rating: number;
  totalRides: number;
  recentHires: number;
  vehicleCategories?: VehicleCategory[];
  isAvailable: boolean;
  isOnline: boolean;
  distance?: number;
  allowCalls: boolean;
  governmentIdVerified: boolean;
  isIndianGovernment: boolean;
  skills?: string[];
  profession?: string;
  currentAvailability?: DriverAvailability;
}