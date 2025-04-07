import { Location } from "@prisma/client";

export interface Vehicle {
  id: string;
  model: string;
  licensePlate: string;
  capacity: number;
  type: VehicleType;
  status: VehicleStatus;
  currentLocation?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export enum VehicleType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  VAN = 'VAN'
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE'
}

// DTOs (Data Transfer Objects)
export type CreateVehicleDto = {
  model: string;
  licensePlate: string;
  capacity: number;
  type: VehicleType;
  status?: VehicleStatus;
};

export type UpdateVehicleDto = Partial<CreateVehicleDto>;

// API Response types
export type VehicleResponse = {
  success: boolean;
  data: Vehicle;
};

export type VehiclesResponse = {
  success: boolean;
  data: Vehicle[];
};

// For error responses
export type ErrorResponse = {
  success: false;
  error: string;
}; 