import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;