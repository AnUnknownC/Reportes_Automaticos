import { Router } from 'express';
const router = Router();
router.post('/login', (req, res) => res.json({ message: 'login ok', body: req.body }));
export default router;