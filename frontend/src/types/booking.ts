import { VehicleType, BookingStatus } from '@prisma/client';

export type CreateBookingPayload = {
  pickupId: string;
  dropId: string;
  scheduledTime: string; // Format: "YYYY-MM-DD HH:mm:ss"
  vehicleType: VehicleType;
  passengerCount: number;
  notes?: string;
};

export type Booking = {
  id: string;
  pickupId: string;
  dropId: string;
  scheduledTime: string;
  vehicleType: VehicleType;
  passengerCount: number;
  notes?: string;
  status: BookingStatus;
  fare: number;
  createdAt: string;
  updatedAt: string;
  pickup: Location;
  drop: Location;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type BookingResponse = {
  success: boolean;
  data: Booking[];
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}; 