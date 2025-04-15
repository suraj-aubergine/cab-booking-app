import { Request, Response } from 'express';
import { prisma } from '../index';
import { startOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const adminController = {
  async getStats(req: Request, res: Response) {
    try {
      // Get current date ranges
      const now = new Date();
      const weekStart = startOfWeek(now);
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Get stats
      const [
        totalUsers,
        newUsersThisWeek,
        activeTodayUsers,
        totalDrivers,
        availableDrivers,
        totalBookings,
        pendingBookings,
        // Add other stats as needed
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: weekStart,
            },
          },
        }),
        prisma.user.count({
          where: {
            lastLoginAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.driver.count(),
        prisma.driver.count({
          where: {
            status: 'AVAILABLE',
          },
        }),
        prisma.booking.count(),
        prisma.booking.count({
          where: {
            status: 'PENDING',
          },
        }),
      ]);

      // Return formatted response
      return res.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            newThisWeek: newUsersThisWeek,
            activeToday: activeTodayUsers,
          },
          drivers: {
            total: totalDrivers,
            available: availableDrivers,
          },
          bookings: {
            total: totalBookings,
            pending: pendingBookings,
          },
          revenue: {
            thisMonth: 0, // Implement actual revenue calculation
            lastMonth: 0,
          },
          incidents: {
            total: 0,
            pending: 0,
          },
          trends: {
            bookings: [], // Implement actual trends
            revenue: [],
            incidents: [],
          },
        },
      });
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error fetching admin stats',
        },
      });
    }
  },
}; 