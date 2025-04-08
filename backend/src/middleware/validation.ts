import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserRole, Gender, VehicleType } from '@prisma/client';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'DRIVER']),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  department: z.string().min(2),
  managerId: z.string().uuid().optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  department: z.string().optional(),
  managerId: z.string().uuid().optional(),
}).strict();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.nativeEnum(UserRole),
  department: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
});

const createBookingSchema = z.object({
  pickupId: z.string().uuid("Invalid pickup location ID"),
  dropId: z.string().uuid("Invalid drop location ID"),
  scheduledTime: z.string().regex(
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    "Invalid datetime format. Expected: YYYY-MM-DD HH:mm:ss"
  ),
  vehicleType: z.nativeEnum(VehicleType),
  passengerCount: z.number().int().min(1).max(10),
  notes: z.string().optional()
});

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    createUserSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createResponse(null, {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        })
      );
    }
    next(error);
  }
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateUserSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid login data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

const validateCreateBooking = (req: Request, res: Response, next: NextFunction) => {
  try {
    createBookingSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid booking data',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

export {
  validateCreateUser,
  validateUpdateUser,
  validateLogin,
  validateRegister,
  validateCreateBooking,
  createBookingSchema
}; 