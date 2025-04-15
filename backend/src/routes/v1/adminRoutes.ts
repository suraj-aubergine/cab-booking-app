import { Router } from 'express';
import { authenticateToken, authorize } from '../../middleware/auth';
import { UserRole } from '@prisma/client';
import { adminController } from '../../controllers/adminController';

const router = Router();

router.get(
  '/stats',
  authenticateToken,
  authorize([UserRole.ADMIN]),
  adminController.getStats
);

export default router; 