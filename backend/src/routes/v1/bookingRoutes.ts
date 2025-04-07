import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { bookingController } from '../../controllers/booking.controller';
import { validateCreateBooking } from '../../middleware/validation';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         pickupId:
 *           type: string
 *           format: uuid
 *         dropId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED]
 *         scheduledTime:
 *           type: string
 *           format: date-time
 *         fare:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         pickup:
 *           $ref: '#/components/schemas/Location'
 *         drop:
 *           $ref: '#/components/schemas/Location'
 *         user:
 *           $ref: '#/components/schemas/User'
 */

// Protect all booking routes
router.use(authenticate);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupId
 *               - dropId
 *               - scheduledTime
 *             properties:
 *               pickupId:
 *                 type: string
 *                 format: uuid
 *               dropId:
 *                 type: string
 *                 format: uuid
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 */
router.post('/create', validateCreateBooking, bookingController.createBooking);

router.post('/', validateCreateBooking, bookingController.createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 */
router.get('/my-bookings', bookingController.getMyBookings);

router.get('/stats', bookingController.getBookingStats);

router.get('/', bookingController.getBookings);

router.get('/:id', bookingController.getBookingById);

router.patch('/:id', bookingController.updateBooking);

router.patch('/:id/status', bookingController.updateBookingStatus);

router.delete('/:id', bookingController.deleteBooking);

export default router; 