import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tripController } from '../../controllers/tripController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, EMPLOYEE, DRIVER]
 *
 *     Driver:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         number:
 *           type: string
 *         model:
 *           type: string
 *         type:
 *           type: string
 *           enum: [SEDAN, SUV, LUXURY]
 *
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         bookingId:
 *           type: string
 *           format: uuid
 *         driverId:
 *           type: string
 *           format: uuid
 *         vehicleId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [ASSIGNED, STARTED, COMPLETED, CANCELLED]
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         booking:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             pickup:
 *               $ref: '#/components/schemas/Location'
 *             drop:
 *               $ref: '#/components/schemas/Location'
 *             user:
 *               $ref: '#/components/schemas/User'
 *         driver:
 *           $ref: '#/components/schemas/Driver'
 *         vehicle:
 *           $ref: '#/components/schemas/Vehicle'
 */

// All trip routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /trips/current:
 *   get:
 *     summary: Get user's current trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current trip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 */
router.get('/current', tripController.getCurrentTrip);

/**
 * @swagger
 * /trips/history:
 *   get:
 *     summary: Get user's trip history
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ASSIGNED, STARTED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: List of trips
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
 *                     $ref: '#/components/schemas/Trip'
 */
router.get('/history', tripController.getTripHistory);

/**
 * @swagger
 * /trips/stats:
 *   get:
 *     summary: Get trip statistics
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     ongoing:
 *                       type: number
 *                     completed:
 *                       type: number
 *                     total:
 *                       type: number
 */
router.get('/stats', tripController.getTripStats);

export default router; 