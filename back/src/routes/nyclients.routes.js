import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { checkPlanLimit } from '../middlewares/checkPlanLimit.js';
import * as ClientsController from '../controllers/clients.controller.js';

const router = Router();

// verifyJWT en todas, checkPlanLimit solo al crear
router.get('/',           verifyJWT, ClientsController.list);
router.post('/',          verifyJWT, checkPlanLimit('create_client'), ClientsController.create);
router.patch('/:id',      verifyJWT, ClientsController.update);
router.patch('/:id/archive', verifyJWT, ClientsController.archive);

export default router;