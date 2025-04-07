import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { adminController } from '../../controllers/admin.controller';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize([UserRole.ADMIN]));

// Stats
router.get('/stats', adminController.getStats);

// Users management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Drivers management
router.get('/drivers', adminController.getDrivers);
router.get('/drivers/:id', adminController.getDriverById);
router.patch('/drivers/:id', adminController.updateDriver);
router.delete('/drivers/:id', adminController.deleteDriver);

// Vehicles management
router.get('/vehicles', adminController.getVehicles);
router.get('/vehicles/:id', adminController.getVehicleById);
router.post('/vehicles', adminController.createVehicle);
router.patch('/vehicles/:id', adminController.updateVehicle);
router.delete('/vehicles/:id', adminController.deleteVehicle);

// Bookings management
router.get('/bookings', adminController.getBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

export default router; 