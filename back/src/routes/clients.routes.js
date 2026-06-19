import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { checkPlanLimit } from '../middlewares/checkLimitPlan.js';
import * as ClientsController from '../controllers/clients.controller.js';

const router = Router();

router.get('/', verifyJWT, ClientsController.list);
router.post('/', verifyJWT, checkPlanLimit('create_client'), ClientsController.create);
router.patch('/:id', verifyJWT, ClientsController.update);
router.patch('/:id/archive', verifyJWT, ClientsController.archive);

export default router;