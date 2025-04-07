import { Router } from 'express';
import { BookingController } from '../../controllers/booking.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createBookingSchema } from '../../schemas/booking.schema';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '@prisma/client';
import { validateCreateBooking } from '../../middleware/validation';

const router = Router();
const bookingController = new BookingController();

// Apply authentication to all booking routes
router.use(authenticate as any);

// Create booking endpoint
router.post('/create', validateCreateBooking, bookingController.createBooking as any);

// Get all bookings (admin only)
router.get('/', authorize([UserRole.ADMIN]) as any, bookingController.getAllBookings as any);

// User's bookings
router.get('/my-bookings', bookingController.getMyBookings as any);

// Booking statistics (admin only)
router.get('/stats', authorize([UserRole.ADMIN]) as any, bookingController.getBookingStats as any);

export default router; 