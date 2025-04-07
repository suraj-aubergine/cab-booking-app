import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { createResponse } from '../utils/response';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json(
        createResponse(null, {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        })
      );
    }
  };
}; 