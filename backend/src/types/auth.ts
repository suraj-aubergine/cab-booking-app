import { Gender } from '@prisma/client';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  department: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

// Extend JwtPayload to include our custom fields
export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Extend Request to use our custom JWT payload
export interface AuthRequest extends Request {
  user?: CustomJwtPayload;
} 