import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createResponse } from '../utils/response';
import { UserRole, Prisma } from '@prisma/client';
import { startOfMonth, subMonths, startOfDay, endOfDay, format } from 'date-fns';

export const adminController = {
  // Stats
  async getStats(req: Request, res: Response) {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastDay = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      const [
        userStats,
        driverStats,
        bookingStats,
        incidents,
        revenue,
        trends
      ] = await Promise.all([
        // User stats
        prisma.$transaction([
          prisma.user.count(),
          prisma.user.count({
            where: {
              createdAt: {
                gte: startOfDay(lastWeek)
              }
            }
          }),
          prisma.user.count({
            where: {
              lastLoginAt: {
                gte: startOfDay(lastDay)
              }
            }
          })
        ]),
        // Driver stats
        prisma.$transaction([
          prisma.driver.count(),
          prisma.driver.count({
            where: {
              status: 'AVAILABLE'
            }
          }),
          prisma.driver.count({
            where: {
              status: 'ON_DUTY'
            }
          })
        ]),
        // Booking stats
        prisma.booking.groupBy({
          by: ['status'],
          _count: true
        }),
        // Incidents
        prisma.$transaction([
          prisma.incident.count(),
          prisma.incident.count({
            where: {
              resolvedAt: null
            }
          })
        ]),
        // Revenue
        prisma.$transaction([
          prisma.booking.aggregate({
            _sum: {
              fare: true
            }
          }),
          prisma.booking.aggregate({
            where: {
              createdAt: {
                gte: startOfMonth(new Date())
              }
            },
            _sum: {
              fare: true
            }
          }),
          prisma.booking.aggregate({
            where: {
              createdAt: {
                gte: startOfMonth(subMonths(new Date(), 1)),
                lt: startOfMonth(new Date())
              }
            },
            _sum: {
              fare: true
            }
          })
        ]),
        // Trends
        prisma.$transaction([
          // Booking trends
          prisma.booking.groupBy({
            by: ['createdAt'],
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            },
            orderBy: {
              createdAt: 'asc'
            },
            _count: true
          }),
          // Revenue trends
          prisma.booking.groupBy({
            by: ['createdAt'],
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            },
            orderBy: {
              createdAt: 'asc'
            },
            _sum: {
              fare: true
            }
          }),
          // Incident trends
          prisma.incident.groupBy({
            by: ['createdAt'],
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            },
            orderBy: {
              createdAt: 'asc'
            },
            _count: true
          })
        ])
      ]);

      const [totalUsers, newUsers, activeUsers] = userStats;
      const [totalDrivers, availableDrivers, onDutyDrivers] = driverStats;
      const [totalIncidents, pendingIncidents] = incidents;
      const [totalRevenue, thisMonthRevenue, lastMonthRevenue] = revenue;
      const [bookingTrends, revenueTrends, incidentTrends] = trends;

      return res.json(createResponse({
        users: {
          total: Number(totalUsers),
          newThisWeek: Number(newUsers),
          activeToday: Number(activeUsers)
        },
        drivers: {
          total: Number(totalDrivers),
          available: Number(availableDrivers),
          onDuty: Number(onDutyDrivers)
        },
        bookings: {
          total: bookingStats.reduce((acc, curr) => acc + Number(curr._count), 0),
          pending: Number(bookingStats.find(b => b.status === 'PENDING')?._count || 0),
          completed: Number(bookingStats.find(b => b.status === 'COMPLETED')?._count || 0),
          cancelled: Number(bookingStats.find(b => b.status === 'CANCELLED')?._count || 0)
        },
        incidents: {
          total: Number(totalIncidents),
          pending: Number(pendingIncidents)
        },
        revenue: {
          total: Number(totalRevenue._sum.fare || 0),
          thisMonth: Number(thisMonthRevenue._sum.fare || 0),
          lastMonth: Number(lastMonthRevenue._sum.fare || 0)
        },
        trends: {
          bookings: bookingTrends.map(trend => ({
            date: format(trend.createdAt, 'yyyy-MM-dd'),
            count: Number(trend._count)
          })),
          revenue: revenueTrends.map(trend => ({
            date: format(trend.createdAt, 'yyyy-MM-dd'),
            amount: Number(trend._sum?.fare || 0)
          })),
          incidents: incidentTrends.map(trend => ({
            date: format(trend.createdAt, 'yyyy-MM-dd'),
            count: Number(trend._count)
          }))
        }
      }));
    } catch (error) {
      console.error('Admin stats error:', error);
      return res.status(500).json(createResponse(null, {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch admin stats'
      }));
    }
  },

  // Users
  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: { not: UserRole.ADMIN }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          createdAt: true
        }
      });

      return res.json(createResponse(users));
    } catch (error) {
      console.error('Get users error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch users'));
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json(createResponse(null, 'User not found'));
      }

      return res.json(createResponse(user));
    } catch (error) {
      console.error('Get user by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch user'));
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id },
        data: req.body,
      });

      return res.json(createResponse(user));
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update user'));
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id } });
      return res.json(createResponse({ success: true }));
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json(createResponse(null, 'Failed to delete user'));
    }
  },

  // Drivers
  async getDrivers(req: Request, res: Response) {
    try {
      const drivers = await prisma.driver.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      return res.json(createResponse(drivers));
    } catch (error) {
      console.error('Get drivers error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch drivers'));
    }
  },

  // Vehicles
  async getVehicles(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany();
      return res.json(createResponse(vehicles));
    } catch (error) {
      console.error('Get vehicles error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch vehicles'));
    }
  },

  // Bookings
  async getBookings(req: Request, res: Response) {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          pickup: true,
          drop: true
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

  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          user: true,
          pickup: true,
          drop: true
        }
      });

      if (!booking) {
        return res.status(404).json(createResponse(null, 'Booking not found'));
      }

      return res.json(createResponse(booking));
    } catch (error) {
      console.error('Get booking by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch booking'));
    }
  },

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const booking = await prisma.booking.update({
        where: { id },
        data: { status }
      });

      return res.json(createResponse(booking));
    } catch (error) {
      console.error('Update booking status error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update booking status'));
    }
  },

  // Additional Driver functions
  async getDriverById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const driver = await prisma.driver.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      if (!driver) {
        return res.status(404).json(createResponse(null, 'Driver not found'));
      }

      return res.json(createResponse(driver));
    } catch (error) {
      console.error('Get driver by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch driver'));
    }
  },

  async updateDriver(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const driver = await prisma.driver.update({
        where: { id },
        data: req.body,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      return res.json(createResponse(driver));
    } catch (error) {
      console.error('Update driver error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update driver'));
    }
  },

  async deleteDriver(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.driver.delete({ where: { id } });
      return res.json(createResponse({ success: true }));
    } catch (error) {
      console.error('Delete driver error:', error);
      return res.status(500).json(createResponse(null, 'Failed to delete driver'));
    }
  },

  // Additional Vehicle functions
  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.findUnique({
        where: { id }
      });

      if (!vehicle) {
        return res.status(404).json(createResponse(null, 'Vehicle not found'));
      }

      return res.json(createResponse(vehicle));
    } catch (error) {
      console.error('Get vehicle by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch vehicle'));
    }
  },

  async createVehicle(req: Request, res: Response) {
    try {
      const vehicle = await prisma.vehicle.create({
        data: req.body
      });

      return res.status(201).json(createResponse(vehicle));
    } catch (error) {
      console.error('Create vehicle error:', error);
      return res.status(500).json(createResponse(null, 'Failed to create vehicle'));
    }
  },

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: req.body
      });

      return res.json(createResponse(vehicle));
    } catch (error) {
      console.error('Update vehicle error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update vehicle'));
    }
  },

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({ where: { id } });
      return res.json(createResponse({ success: true }));
    } catch (error) {
      console.error('Delete vehicle error:', error);
      return res.status(500).json(createResponse(null, 'Failed to delete vehicle'));
    }
  }
}; 