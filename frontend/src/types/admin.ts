import { UserRole, Gender, VehicleType, BookingStatus } from '@prisma/client';

// User related types
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  licenseNumber: string;
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
  rating: number;
  vehicle?: Vehicle;
}

export interface Vehicle {
  id: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
  capacity: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  driver?: Driver;
}

export interface AdminBooking {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  pickup: {
    name: string;
    address: string;
  };
  drop: {
    name: string;
    address: string;
  };
  scheduledTime: string;
  status: BookingStatus;
  fare: number;
  driver?: Driver;
  vehicle?: Vehicle;
  createdAt: string;
}

// Response types
export interface AdminResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface TrendData {
  date: string;
  count: number;
}

export interface RevenueTrendData {
  date: string;
  amount: number;
}

export interface AdminStats {
  users: {
    total: number;
    newThisWeek: number;
    activeToday: number;
  };
  drivers: {
    total: number;
    available: number;
    onDuty: number;
  };
  bookings: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  incidents: {
    total: number;
    pending: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  trends: {
    bookings: TrendData[];
    revenue: RevenueTrendData[];
    incidents: TrendData[];
  };
} 