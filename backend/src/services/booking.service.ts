import { BookingStatus, VehicleType, Prisma } from '@prisma/client';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingService {
  async createBooking(data: {
    userId: string;
    pickupId: string;
    dropId: string;
    scheduledTime: Date;
    vehicleType: VehicleType;
    passengerCount: number;
    notes?: string;
  }) {
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        pickupId: data.pickupId,
        dropId: data.dropId,
        scheduledTime: data.scheduledTime,
        vehicleType: data.vehicleType,
        passengerCount: data.passengerCount,
        notes: data.notes,
        status: BookingStatus.PENDING,
        fare: 0 // Calculate fare here if needed
      },
      include: {
        pickup: true,
        drop: true,
        user: true
      }
    });
    return booking;
  }

  async getAllBookings() {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          pickup: true,
          drop: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          scheduledTime: 'desc',
        },
      });

      return bookings;
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingsByUserId(userId: string) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { 
          userId 
        },
        include: {
          pickup: true,
          drop: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return bookings;
    } catch (error) {
      console.error('Error in getBookingsByUserId:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error(`Failed to fetch bookings for user ${userId}`);
    }
  }

  async getBookingStats() {
    try {
      const [
        total,
        pending,
        confirmed,
        inProgress,
        completed,
        cancelled,
      ] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
        prisma.booking.count({ where: { status: BookingStatus.APPROVED } }),
        prisma.booking.count({ where: { status: BookingStatus.IN_PROGRESS } }),
        prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
        prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),
      ]);

      return {
        total,
        pending,
        confirmed,
        inProgress,
        completed,
        cancelled,
      };
    } catch (error) {
      console.error('Error in getBookingStats:', error);
      throw new Error('Failed to fetch booking statistics: ' + (error as Error).message);
    }
  }
} 