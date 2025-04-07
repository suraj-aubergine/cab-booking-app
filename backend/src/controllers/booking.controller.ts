import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createResponse } from '../utils/response';
import { UserRole } from '@prisma/client';

export const bookingController = {
  async getBookings(req: Request, res: Response) {
    try {
      // Only admins and managers can see all bookings
      if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.MANAGER) {
        return res.status(403).json(createResponse(null, 'Unauthorized to view all bookings'));
      }

      const bookings = await prisma.booking.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          pickup: true,
          drop: true,
          vehicle: true,
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.json(createResponse(bookings));
    } catch (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch bookings'));
    }
  },

  async getMyBookings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(createResponse(null, 'User not authenticated'));
      }
      
      const bookings = await prisma.booking.findMany({
        where: {
          userId
        },
        include: {
          pickup: true,
          drop: true,
          vehicle: true,
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.json(createResponse(bookings));
    } catch (error) {
      console.error('Get my bookings error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch your bookings'));
    }
  },

  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          pickup: true,
          drop: true,
          vehicle: true,
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      if (!booking) {
        return res.status(404).json(createResponse(null, 'Booking not found'));
      }

      // Check if user is authorized to view this booking
      if (booking.userId !== userId && 
          req.user.role !== UserRole.ADMIN && 
          req.user.role !== UserRole.MANAGER) {
        return res.status(403).json(createResponse(null, 'Unauthorized to view this booking'));
      }

      return res.json(createResponse(booking));
    } catch (error) {
      console.error('Get booking by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch booking'));
    }
  },

  async createBooking(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(createResponse(null, 'User not authenticated'));
      }
      
      console.log('Creating booking with data:', {
        userId,
        requestBody: req.body
      });
      
      // Validate required fields
      const { pickupId, dropId, scheduledTime } = req.body;
      
      if (!pickupId || !dropId || !scheduledTime) {
        return res.status(400).json(createResponse(null, 'Missing required fields: pickupId, dropId, and scheduledTime are required'));
      }
      
      // Check if locations exist
      const [pickup, drop] = await Promise.all([
        prisma.location.findUnique({ where: { id: pickupId } }),
        prisma.location.findUnique({ where: { id: dropId } })
      ]);
      
      if (!pickup) {
        return res.status(404).json(createResponse(null, `Pickup location with ID ${pickupId} not found`));
      }
      
      if (!drop) {
        return res.status(404).json(createResponse(null, `Drop location with ID ${dropId} not found`));
      }
      
      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          userId,
          pickupId,
          dropId,
          scheduledTime: new Date(scheduledTime),
          status: 'PENDING',
          // Add any other required fields with default values
          fare: 0, // Calculate fare if needed
        },
        include: {
          pickup: true,
          drop: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
      
      console.log('Booking created successfully:', booking);
      
      return res.status(201).json(createResponse(booking));
    } catch (error) {
      console.error('Create booking error:', error);
      
      // Provide more detailed error information
      let errorMessage = 'Failed to create booking';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      
      return res.status(500).json(createResponse(null, errorMessage));
    }
  },

  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Check if booking exists and belongs to user
      const existingBooking = await prisma.booking.findUnique({
        where: { id }
      });

      if (!existingBooking) {
        return res.status(404).json(createResponse(null, 'Booking not found'));
      }

      // Check if user is authorized to update this booking
      if (existingBooking.userId !== userId && 
          req.user.role !== UserRole.ADMIN && 
          req.user.role !== UserRole.MANAGER) {
        return res.status(403).json(createResponse(null, 'Unauthorized to update this booking'));
      }

      const booking = await prisma.booking.update({
        where: { id },
        data: req.body,
        include: {
          pickup: true,
          drop: true
        }
      });

      return res.json(createResponse(booking));
    } catch (error) {
      console.error('Update booking error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update booking'));
    }
  },

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Only admins, managers, and drivers can update booking status
      if (req.user.role !== UserRole.ADMIN && 
          req.user.role !== UserRole.MANAGER && 
          req.user.role !== UserRole.DRIVER) {
        return res.status(403).json(createResponse(null, 'Unauthorized to update booking status'));
      }

      const booking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          pickup: true,
          drop: true
        }
      });

      return res.json(createResponse(booking));
    } catch (error) {
      console.error('Update booking status error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update booking status'));
    }
  },

  async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Check if booking exists and belongs to user
      const existingBooking = await prisma.booking.findUnique({
        where: { id }
      });

      if (!existingBooking) {
        return res.status(404).json(createResponse(null, 'Booking not found'));
      }

      // Check if user is authorized to delete this booking
      if (existingBooking.userId !== userId && 
          req.user.role !== UserRole.ADMIN && 
          req.user.role !== UserRole.MANAGER) {
        return res.status(403).json(createResponse(null, 'Unauthorized to delete this booking'));
      }

      await prisma.booking.delete({ where: { id } });
      return res.json(createResponse({ success: true }));
    } catch (error) {
      console.error('Delete booking error:', error);
      return res.status(500).json(createResponse(null, 'Failed to delete booking'));
    }
  },

  async getBookingStats(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      const [pending, upcoming, total] = await Promise.all([
        // Pending bookings
        prisma.booking.count({
          where: {
            userId,
            status: 'PENDING'
          }
        }),
        // Upcoming bookings
        prisma.booking.count({
          where: {
            userId,
            status: 'APPROVED',
            scheduledTime: {
              gte: new Date()
            }
          }
        }),
        // Total bookings
        prisma.booking.count({
          where: {
            userId
          }
        })
      ]);
      
      return res.json(createResponse({
        pending,
        upcoming,
        total
      }));
    } catch (error) {
      console.error('Get booking stats error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch booking statistics'));
    }
  }
}; 