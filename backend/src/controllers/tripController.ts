import { Request, Response } from 'express';
import { prisma } from '../index';
import { TripStatus } from '@prisma/client';

export const tripController = {
  async getCurrentTrip(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const trip = await prisma.trip.findFirst({
        where: {
          booking: {
            userId
          },
          status: {
            in: [TripStatus.STARTED, TripStatus.ASSIGNED]
          }
        },
        include: {
          booking: {
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
          },
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          vehicle: true
        }
      });

      return res.json({
        success: true,
        data: trip
      });
    } catch (error) {
      console.error('Get current trip error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch current trip'
        }
      });
    }
  },

  async getTripHistory(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { status } = req.query;

      const trips = await prisma.trip.findMany({
        where: {
          booking: {
            userId
          },
          ...(status ? { status: status as TripStatus } : {})
        },
        include: {
          booking: {
            include: {
              pickup: true,
              drop: true
            }
          },
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          vehicle: true
        },
        orderBy: {
          startTime: 'desc'
        }
      });

      return res.json({
        success: true,
        data: trips
      });
    } catch (error) {
      console.error('Get trip history error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch trip history'
        }
      });
    }
  },

  async getTripStats(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const [ongoing, completed, total] = await Promise.all([
        prisma.trip.count({
          where: {
            booking: {
              userId
            },
            status: {
              in: [TripStatus.STARTED, TripStatus.ASSIGNED]
            }
          }
        }),
        prisma.trip.count({
          where: {
            booking: {
              userId
            },
            status: TripStatus.COMPLETED
          }
        }),
        prisma.trip.count({
          where: {
            booking: {
              userId
            }
          }
        })
      ]);

      return res.json({
        success: true,
        data: {
          ongoing,
          completed,
          total
        }
      });
    } catch (error) {
      console.error('Get trip stats error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get trip stats'
        }
      });
    }
  }
}; 