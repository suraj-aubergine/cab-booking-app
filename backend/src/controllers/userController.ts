import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createResponse } from '../utils/response';
import { UserRole } from '@prisma/client';
import { hashPassword } from '../utils/password';

export const userController = {
  // Get all users with pagination
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;

      const where = search ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      } : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            department: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.user.count({ where }),
      ]);

      return res.json(createResponse({
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }));
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json(
        createResponse(null, 'Failed to fetch users')
      );
    }
  },

  // Get user by ID
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
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching user',
        },
      });
    }
  },

  // Create new user
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, gender, department } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json(
          createResponse(null, {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
          })
        );
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role,
          gender,
          department,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          gender: true,
          department: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(201).json(createResponse(user));
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(500).json(
        createResponse(null, {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })
      );
    }
  },

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove sensitive fields from update data
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          });
        }
      }
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating user',
        },
      });
    }
  },

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          });
        }
      }
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting user',
        },
      });
    }
  },
}; 