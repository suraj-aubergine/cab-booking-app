import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();

// All SOS routes require authentication
router.use(authenticate);

router.get('/', async (req, res) => {
  // TODO: Implement getAllSOSRequests
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', async (req, res) => {
  // TODO: Implement getSOSRequestById
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', async (req, res) => {
  // TODO: Implement createSOSRequest
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/:id', async (req, res) => {
  // TODO: Implement resolveSOSRequest
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 