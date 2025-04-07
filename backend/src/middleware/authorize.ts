import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth';
import { createResponse } from '../utils/response';

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        createResponse(null, {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource',
        })
      );
    }
    next();
  };
}; 