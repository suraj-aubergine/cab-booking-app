import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { comparePasswords, hashPassword } from '../utils/auth';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Gender } from '@prisma/client';

export const authController = {
  async login(req: Request<{}, {}, LoginRequest>, res: Response) {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      console.log('Found user:', user ? 'yes' : 'no');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Generate JWT token with proper typing
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const tokenPayload = {
        userId: user.id,
        role: user.role
      };

      const signOptions: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      };

      const token = jwt.sign(tokenPayload, jwtSecret, signOptions);

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            gender: user.gender,
            department: user.department,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during login',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, department } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
          },
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role,
          department,
          gender: Gender.OTHER, // Set a default value for required gender field
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to register user',
        },
      });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          gender: true,
          department: true,
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
      console.error('Get current user error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching user data',
        },
      });
    }
  },
}; 