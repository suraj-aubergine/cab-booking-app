import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { vehicleController } from '../../controllers/vehicle.controller';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect all vehicle routes
router.use(authenticate);

// Public routes (accessible to all authenticated users)
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Admin-only routes
router.post('/', authorize([UserRole.ADMIN]), vehicleController.createVehicle);
router.patch('/:id', authorize([UserRole.ADMIN]), vehicleController.updateVehicle);
router.delete('/:id', authorize([UserRole.ADMIN]), vehicleController.deleteVehicle);

export default router; 