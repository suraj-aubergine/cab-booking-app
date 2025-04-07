import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();

// All incident routes require authentication
router.use(authenticate);

router.get('/', async (req, res) => {
  // TODO: Implement getAllIncidents
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', async (req, res) => {
  // TODO: Implement getIncidentById
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', async (req, res) => {
  // TODO: Implement createIncident
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 