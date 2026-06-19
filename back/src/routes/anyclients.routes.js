import { Router } from 'express';
const router = Router();
router.get('/',    (req, res) => res.json({ message: 'list clients ok' }));
router.post('/',   (req, res) => res.status(201).json({ message: 'create client ok', body: req.body }));
router.patch('/:id',         (req, res) => res.json({ message: `update ${req.params.id} ok` }));
router.patch('/:id/archive', (req, res) => res.json({ message: `archive ${req.params.id} ok` }));
export default router;