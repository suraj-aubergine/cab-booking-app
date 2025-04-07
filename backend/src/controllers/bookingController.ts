import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import { prisma } from '../index';
import { BookingStatus, VehicleType } from '@prisma/client';
import { BookingService } from '../services/booking.service';

export const bookingController = {
  async createBooking(req: AuthRequest, res: Response) {
    try {
      const { pickupId, dropId, scheduledTime, vehicleType, passengerCount, notes } = req.body;
      const userId = req.user!.id;

      // Get locations to calculate fare
      const [pickup, drop] = await Promise.all([
        prisma.location.findUnique({ where: { id: pickupId } }),
        prisma.location.findUnique({ where: { id: dropId } })
      ]);

      if (!pickup || !drop) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_LOCATION',
            message: 'Invalid pickup or drop location'
          }
        });
      }

      // Calculate base fare based on vehicle type
      const baseFares: Record<VehicleType, number> = {
        [VehicleType.SEDAN]: 250,
        [VehicleType.SUV]: 350,
        [VehicleType.VAN]: 450
      };

      // Calculate distance-based fare
      const distance = Math.abs(pickup.distanceFromOffice - drop.distanceFromOffice);
      const perKmRate = vehicleType === VehicleType.SEDAN ? 50 : vehicleType === VehicleType.SUV ? 70 : 90;
      
      // Calculate total fare
      const fare = baseFares[vehicleType as VehicleType] + (distance * perKmRate);

      const booking = await prisma.booking.create({
        data: {
          userId,
          pickupId,
          dropId,
          scheduledTime: new Date(scheduledTime),
          vehicleType: vehicleType as VehicleType,
          passengerCount,
          notes,
          status: BookingStatus.PENDING,
          fare: Math.round(fare)
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
        }
      });

      return res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Create booking error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create booking'
        }
      });
    }
  },

  async getBookings(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const bookingService = new BookingService();
      const bookings = await bookingService.getBookingsByUserId(userId);

      return res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_BOOKINGS_ERROR',
          message: (error as Error).message || 'Failed to fetch bookings',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      });
    }
  },

  async getBookingStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const [pending, upcoming, total] = await Promise.all([
        prisma.booking.count({
          where: {
            userId,
            status: BookingStatus.PENDING
          }
        }),
        prisma.booking.count({
          where: {
            userId,
            status: BookingStatus.APPROVED,
            scheduledTime: {
              gte: new Date()
            }
          }
        }),
        prisma.booking.count({
          where: {
            userId
          }
        })
      ]);

      return res.json({
        success: true,
        data: {
          pending,
          upcoming,
          total
        }
      });
    } catch (error) {
      console.error('Get booking stats error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get booking stats'
        }
      });
    }
  }
}; 