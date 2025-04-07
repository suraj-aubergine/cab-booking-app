import { Router } from 'express';
import userRoutes from './userRoutes';
import driverRoutes from './driverRoutes';
import vehicleRoutes from './vehicleRoutes';
import locationRoutes from './locationRoutes';
import bookingRoutes from './bookingRoutes';
import adminRoutes from './admin.routes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/locations', locationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;