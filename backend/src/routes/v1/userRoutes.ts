import { Router } from 'express';
import { userController } from '../../controllers/userController';
import { validateCreateUser, validateUpdateUser } from '../../middleware/validation';
import { authenticateToken, authorize } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Creates a new user in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *               - gender
 *               - department
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [EMPLOYEE, MANAGER, ADMIN]
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               department:
 *                 type: string
 *               managerId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
router.post('/', validateCreateUser, userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve a list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authenticateToken, authorize([UserRole.ADMIN]), (req, res, next) => userController.getAllUsers(req, res));
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, validateUpdateUser, userController.updateUser);
router.delete('/:id', authenticateToken, authorize([UserRole.ADMIN]), userController.deleteUser);

export default router; 