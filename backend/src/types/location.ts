export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
  vehicleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateLocationDto {
  latitude: number;
  longitude: number;
  address?: string | undefined;
  vehicleId: string;
}

export type UpdateLocationDto = Partial<CreateLocationDto>;

// API Response types
export type LocationResponse = {
  success: boolean;
  data: Location;
};

export type LocationsResponse = {
  success: boolean;
  data: Location[];
};

export type ErrorResponse = {
  success: false;
  error: string;
}; 